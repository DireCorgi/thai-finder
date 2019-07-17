# Schema For Thai Finder
This is the schema for the thai finder app, along with some design decisions.

## Sample Data
```
{
  CAMIS: '30075445',
  DBA: 'MORRIS PARK BAKE SHOP',
  BORO: 'BRONX',
  BUILDING: '1007',
  STREET: 'MORRIS PARK AVE',
  ZIPCODE: '10462',
  PHONE: '7188924968',
  'CUISINE DESCRIPTION': 'Bakery',
  'INSPECTION DATE': '06/11/2019',
  ACTION: 'Violations were cited in the following area(s).',
  'VIOLATION CODE': '08C',
  'VIOLATION DESCRIPTION': 'Pesticide use not in accordance with label or applicable laws. Prohibited chemical used/stored. Open bait station used.',
  'CRITICAL FLAG': 'Not Critical',
  SCORE: '6',
  GRADE: 'A',
  'GRADE DATE': '06/11/2019',
  'RECORD DATE': '07/16/2019',
  'INSPECTION TYPE': 'Cycle Inspection / Re-inspection' 
}
```

## Notes
1. We don't need to store data for all restaurants. Since this is for thai restaurants only, we could skip any non thai restaurant to save space.
2. The metadata is could be useful in the future, but we don't need that to deliver the current restaurant grade.
3. The grade is the grade from the latest inspection.

### Restaurants
- id: primary_key (can use CAMIS)
- name: string
- address: string (composition of building + street)
- zipcode: string
- phone: string
- cuisine_type: string, indexed (should all be thai if we skip non-thai restaurants, but including in case we want to expand this feature)
- current_grade: string, indexed (denormalizing field of the latest grade of the restaurant)
- created_at: date
Restaurants will be where the meat of our data will be stored. To ensure fast data calls, we will be denormalizing the current_grade field, (normally this would be the latest of the inspection's grade). We will need to keep this denormailization when processing data. 

### Inspections
- id: primary_key
- restaurant_id: foreign_key to restaurants
- inspection_date: date
- grade: string
- score: string
- grade_date: date
- record_date: date
- inspection_type: string
- created_at: date

### Violations
- id: 