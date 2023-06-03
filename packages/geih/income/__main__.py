from sqlalchemy import (
    create_engine,
    select,
    Table,
    MetaData,
    Engine,
    func,
)
import os


def get_tables(metadata: MetaData, engine: Engine):
    income_table = Table("fact_income_permille", metadata, autoload_with=engine)
    income_dept_table = Table(
        "fact_income_permille_dept", metadata, autoload_with=engine
    )
    income_dept_zone_table = Table(
        "fact_income_permille_dept_zone", metadata, autoload_with=engine
    )
    divipola_table = Table("seed_divipola", metadata, autoload_with=engine)
    return (
        income_table,
        income_dept_table,
        income_dept_zone_table,
        divipola_table,
        engine,
    )


def get_income_quantiles(
    income: int,
    department: str,
    zone: int,
    income_table: Table,
    income_dept_table: Table,
    income_dept_zone_table: Table,
    divipola_table: Table,
    engine: Engine,
):
    with engine.connect() as conn:
        quantile_below = conn.execute(
            select(func.coalesce(func.max(income_table.c.quantile), 0)).where(
                income_table.c.income < income
            )
        )[0].quantile
        quantile_above = conn.execute(
            select(func.min(income_table.c.quantile)).where(
                income_table.c.income > income
            )
        )[0].quantile
        dept_quantile_below = conn.execute(
            select(func.coalesce(func.max(income_dept_table.c.quantile), 0))
            .where(income_dept_table.c.income < income)
            .where(income_dept_table.c.department == department)
        )[0].quantile
        dept_quantile_above = conn.execute(
            select(func.min(income_dept_table.c.quantile))
            .where(income_dept_table.c.income > income)
            .where(income_dept_table.c.department == department)
        )[0].quantile
        dept_zone_quantile_below = conn.execute(
            select(func.coalesce(func.max(income_dept_zone_table.c.quantile), 0))
            .where(income_dept_zone_table.c.income < income)
            .where(income_dept_zone_table.c.department == department)
            .where(income_dept_zone_table.c.zone == zone)
        )[0].quantile
        dept_zone_quantile_above = conn.execute(
            select(func.min(income_dept_zone_table.c.quantile))
            .where(income_dept_zone_table.c.income > income)
            .where(income_dept_zone_table.c.department == department)
            .where(income_dept_zone_table.c.zone == zone)
        )[0].quantile
        dept_str = conn.execute(
            select(divipola_table.c.name).where(divipola_table.c.code == department)
        )[0].name
    return (
        int(quantile_below),
        int(quantile_above),
        int(dept_quantile_below),
        int(dept_quantile_above),
        int(dept_zone_quantile_below),
        int(dept_zone_quantile_above),
        str(dept_str),
    )


def prettify_results(
    income: int,
    zone: int,
    quantile_below: int,
    quantile_above: int,
    dept_quantile_below: int,
    dept_quantile_above: int,
    dept_zone_quantile_below: int,
    dept_zone_quantile_above: int,
    dept_str: str,
):
    result = {}
    single_quantile = False
    single_quantile_dept = False
    single_quantile_dept_zone = False
    zone_str = ""
    if quantile_below == 999 or quantile_below - quantile_above == 1:
        single_quantile = True
    if dept_quantile_below == 999 or dept_quantile_below - dept_quantile_above == 1:
        single_quantile_dept = True
    if (
        dept_zone_quantile_below == 999
        or dept_zone_quantile_below - dept_zone_quantile_above == 1
    ):
        single_quantile_dept_zone = True
    if zone == 1:
        zone_str = "urbana"
    else:
        zone_str = "rural"

    result["income"] = f"Tienes un ingreso de ${income:,} pesos mensuales."
    # National income quantiles
    result[
        "national_income_1"
    ] = f"Estás en el {1-(quantile_below/1000):.1%} más alto de ingresos a nivel nacional."
    if not single_quantile:
        result[
            "national_income_2"
        ] = f"El {(quantile_above-quantile_below-1)/1000:.1%} de la población en Colombia tiene tus mismos ingresos."
    result[
        "national_income_3"
    ] = f"En un salón con 1000 residentes de Colombia tendrías más ingresos que {quantile_below:.0f} de ellas."
    # Department income quantiles
    result[
        "department_income_1"
    ] = f"Estás en el {1-(dept_quantile_below/1000):.1%} más alto de ingresos en {dept_str}."
    if not single_quantile_dept:
        result[
            "department_income_2"
        ] = f"El {(dept_quantile_above-dept_quantile_below-1)/1000:.1%} de la población en {dept_str} tiene tus mismos ingresos."
    result[
        "department_income_3"
    ] = f"En un salón con 1000 residentes de {dept_str} tendrías más ingresos que {dept_quantile_below:.0f} de ellas."
    # Department and zone income quantiles
    result[
        "department_zone_income_1"
    ] = f"Estás en el {1-(dept_zone_quantile_below/1000):.1%} más alto de ingresos en la zona {zone_str} de {dept_str}."
    if not single_quantile_dept_zone:
        result[
            "department_zone_income_2"
        ] = f"El {(dept_zone_quantile_above-dept_zone_quantile_below-1)/1000:.1%} de la población en la zona {zone_str} de {dept_str} tiene tus mismos ingresos."
    result[
        "department_zone_income_3"
    ] = f"En un salón con 1000 residentes de la zona {zone_str} de {dept_str} tendrías más ingresos que {dept_zone_quantile_below:.0f} de ellas."
    return result


def main(args):
    income = args.get("income", -1)
    department = args.get("department", "unknown")
    zone = args.get("zone", "unknown")
    if int(income) < 0 or department == "unknown" or zone == "unknown":
        return {"error": "Please provide income, department, and zone."}
    # get connection parameters from environment variables
    protocol = os.environ['PROTOCOL']
    user = os.environ['USER']
    password = os.environ['PASSWORD']
    host = os.environ['HOST']
    port = os.environ['PORT']
    db = os.environ['DB']
    connstring = f"{protocol}://{user}:{password}@{host}:{port}/{db}"
    engine = create_engine(connstring)
    metadata = MetaData(schema="public")
    metadata.reflect(
        bind=engine,
        only=[
            "fact_income_permille",
            "fact_income_permille_dept",
            "fact_income_permille_dept_zone",
            "seed_divipola",
        ],
    )
    return prettify_results(
        income=int(income),
        zone=int(zone),
        *get_income_quantiles(
            income=int(income),
            department=department,
            zone=int(zone),
            *get_tables(metadata, engine),
        ),
    )
