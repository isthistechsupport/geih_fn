import csv


def read_csv_to_dict(file_path):
    data = []
    with open(file_path, "r") as file:
        reader = csv.DictReader(file)
        for row in reader:
            data.append(row)
    return data


def get_files():
    fact_income_permille_file = "fact_income_permille.csv"
    fact_income_permille_dept_file = "fact_income_permille_dept.csv"
    fact_income_permille_dept_zone_file = "fact_income_permille_dept_zone.csv"
    
    fact_income_permille = read_csv_to_dict(fact_income_permille_file)
    fact_income_permille_dept = read_csv_to_dict(fact_income_permille_dept_file)
    fact_income_permille_dept_zone = read_csv_to_dict(fact_income_permille_dept_zone_file)
    
    return fact_income_permille, fact_income_permille_dept, fact_income_permille_dept_zone


def get_quantile(data, income: int, department: str = None, zone: int = None, above: bool = True):
    incomes = data
    if department:
        incomes = [d for d in incomes if d['department'] == department]
        print(len(incomes))
    if zone:
        incomes = [d for d in incomes if d['zone'] == zone]
        print(len(incomes))
    if above:
        incomes = [d['quantile'] for d in incomes if d['income'] > income]
        print(len(incomes))
        if incomes:
            return min(incomes)
        else:
            return None
    else:
        incomes = [d['quantile'] for d in incomes if d['income'] < income]
        if incomes:
            return max(incomes)
        else:
            return None


def main(args):
    try:
        income = args.get("income", -1)
        department = args.get("department", "unknown")
        zone = args.get("zone", -1)
    except Exception as e:
        return {"error": f"Error: {e}"}
    if int(income) < 0 or department == "unknown" or int(zone) == -1:
        return {"error": "Please provide income, department, and zone."}
    income_data, income_dept_data, income_dept_zone_data = get_files()
    quantile_below = get_quantile(income_data, int(income), above=False)
    quantile_above = get_quantile(income_data, int(income), above=True)
    dept_quantile_below = get_quantile(income_dept_data, int(income), department, above=False)
    dept_quantile_above = get_quantile(income_dept_data, int(income), department, above=True)
    dept_zone_quantile_below = get_quantile(income_dept_zone_data, int(income), department, int(zone), above=False)
    dept_zone_quantile_above = get_quantile(income_dept_zone_data, int(income), department, int(zone), above=True)
    result = {
        "quantileBelow": quantile_below,
        "quantileAbove": quantile_above,
        "deptQuantileBelow": dept_quantile_below,
        "deptQuantileAbove": dept_quantile_above,
        "deptZoneQuantileBelow": dept_zone_quantile_below,
        "deptZoneQuantileAbove": dept_zone_quantile_above,
    }
    return {"body": result}
