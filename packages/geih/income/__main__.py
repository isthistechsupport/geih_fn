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
    return (income_table, income_dept_table, income_dept_zone_table)


def get_income_quantiles(
    income: int,
    department: str,
    zone: int,
    income_table: Table,
    income_dept_table: Table,
    income_dept_zone_table: Table,
    engine: Engine,
):
    with engine.connect() as conn:
        quantile_below = conn.execute(
            select(func.coalesce(func.max(income_table.c.quantile), 0)).where(
                income_table.c.income < income
            )
        ).scalar_one()
        quantile_above = conn.execute(
            select(func.min(income_table.c.quantile)).where(
                income_table.c.income > income
            )
        ).scalar_one()
        dept_quantile_below = conn.execute(
            select(func.coalesce(func.max(income_dept_table.c.quantile), 0))
            .where(income_dept_table.c.income < income)
            .where(income_dept_table.c.department == department)
        ).scalar_one()
        dept_quantile_above = conn.execute(
            select(func.min(income_dept_table.c.quantile))
            .where(income_dept_table.c.income > income)
            .where(income_dept_table.c.department == department)
        ).scalar_one()
        dept_zone_quantile_below = conn.execute(
            select(func.coalesce(func.max(income_dept_zone_table.c.quantile), 0))
            .where(income_dept_zone_table.c.income < income)
            .where(income_dept_zone_table.c.department == department)
            .where(income_dept_zone_table.c.zone == zone)
        ).scalar_one()
        dept_zone_quantile_above = conn.execute(
            select(func.min(income_dept_zone_table.c.quantile))
            .where(income_dept_zone_table.c.income > income)
            .where(income_dept_zone_table.c.department == department)
            .where(income_dept_zone_table.c.zone == zone)
        ).scalar_one()
    return (
        int(quantile_below),
        int(quantile_above),
        int(dept_quantile_below),
        int(dept_quantile_above),
        int(dept_zone_quantile_below),
        int(dept_zone_quantile_above),
    )


def prettify_results(
    income: int,
    department: str,
    zone: int,
    quantile_below: int,
    quantile_above: int,
    dept_quantile_below: int,
    dept_quantile_above: int,
    dept_zone_quantile_below: int,
    dept_zone_quantile_above: int,
):
    return {
        "income": income,
        "department": department,
        "zone": zone,
        "quantile_below": quantile_below,
        "quantile_above": quantile_above,
        "dept_quantile_below": dept_quantile_below,
        "dept_quantile_above": dept_quantile_above,
        "dept_zone_quantile_below": dept_zone_quantile_below,
        "dept_zone_quantile_above": dept_zone_quantile_above
    }


def main(args):
    income = args.get("income", -1)
    department = args.get("department", "unknown")
    zone = args.get("zone", -1)
    if int(income) < 0 or department == "unknown" or int(zone) == -1:
        return {"error": "Please provide income, department, and zone."}
    # get connection parameters from environment variables
    dbprotocol = os.environ["DBPROTOCOL"]
    dbdriver = os.environ["DBDRIVER"]
    dbuser = os.environ["DBUSER"]
    dbpassword = os.environ["DBPASSWORD"]
    dbhost = os.environ["DBHOST"]
    dbport = os.environ["DBPORT"]
    dbname = os.environ["DBNAME"]
    dbsslmode = os.environ["DBSSLMODE"]
    connstring = (
        f"{dbprotocol}+{dbdriver}://{dbuser}:{dbpassword}@{dbhost}:{dbport}/{dbname}"
    )
    engine = create_engine(connstring, connect_args={"sslmode": dbsslmode})
    metadata = MetaData(schema="public")
    metadata.reflect(
        bind=engine,
        only=[
            "fact_income_permille",
            "fact_income_permille_dept",
            "fact_income_permille_dept_zone"
        ],
    )
    (
        income_table,
        income_dept_table,
        income_dept_zone_table,
    ) = get_tables(metadata=metadata, engine=engine)
    (
        quantile_below,
        quantile_above,
        dept_quantile_below,
        dept_quantile_above,
        dept_zone_quantile_below,
        dept_zone_quantile_above,
    ) = get_income_quantiles(
        income=int(income),
        department=department,
        zone=int(zone),
        income_table=income_table,
        income_dept_table=income_dept_table,
        income_dept_zone_table=income_dept_zone_table,
        engine=engine,
    )
    result = prettify_results(
        income=int(income),
        department=department,
        zone=int(zone),
        quantile_below=quantile_below,
        quantile_above=quantile_above,
        dept_quantile_below=dept_quantile_below,
        dept_quantile_above=dept_quantile_above,
        dept_zone_quantile_below=dept_zone_quantile_below,
        dept_zone_quantile_above=dept_zone_quantile_above,
    )
    return {"body": result}
