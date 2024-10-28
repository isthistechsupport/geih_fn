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
        quantile_below,
        quantile_above,
        dept_quantile_below,
        dept_quantile_above,
        dept_zone_quantile_below,
        dept_zone_quantile_above,
    )


def main(args):
    try:
        income = args.get("income", -1)
        department = args.get("department", "unknown")
        zone = args.get("zone", -1)
    except Exception as e:
        return {"error": f"Error: {e}"}
    if int(income) < 0 or department == "unknown" or int(zone) == -1:
        return {"error": "Please provide income, department, and zone."}
    # get connection URL from environment variable
    engine = create_engine(os.getenv("DATABASE_URL"))
    metadata = MetaData(schema="public")
    metadata.reflect(
        bind=engine,
        only=[
            "fact_income_permille",
            "fact_income_permille_dept",
            "fact_income_permille_dept_zone",
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
    result = {
        "quantileBelow": quantile_below,
        "quantileAbove": quantile_above,
        "deptQuantileBelow": dept_quantile_below,
        "deptQuantileAbove": dept_quantile_above,
        "deptZoneQuantileBelow": dept_zone_quantile_below,
        "deptZoneQuantileAbove": dept_zone_quantile_above,
    }
    return {"body": result}
