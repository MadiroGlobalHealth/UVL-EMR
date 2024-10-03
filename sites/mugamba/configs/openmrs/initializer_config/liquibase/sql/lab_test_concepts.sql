insert into concept_datatype (`concept_datatype_id`, `name`, `creator`,`date_created`, `Uuid`) 
values 
    ('51', "Quantitative", '1', '2024-10-02 10:32:20', '5d801c12-79cf-443b-8b1b-ff3bb8a58f3d'),
    ('52', "Qualitative", '1', '2024-10-02 10:32:20', 'f3ce2cb7-8445-41bc-b9f6-70f320c37fd4');


insert into concept_class (`concept_class_id`, `name`, `creator`,`date_created`, `Uuid`) 
values 
    ('31', "Imaging", '1', '2024-10-02 10:32:20', 'cf181752-1d97-4ca6-808e-bc0bbd1f140f'),
    ('32', "Immunology", '1', '2024-10-02 10:32:20', '055ec52c-ee38-4609-b4cb-e315dd3b62b2'),
    ('33', "Clinical", '1', '2024-10-02 10:32:20', '4f84c893-5838-49c9-ae53-44978a278ef6'),
    ('34', "Microbiology", '1', '2024-10-02 10:32:20', 'f9dd9e25-77c6-467a-bd55-b0c0ef8658f2'),
    ('35', "Chemistry", '1', '2024-10-02 10:32:20', '94c2d310-961e-4372-bf71-893482cc19b0'),
    ('36', "Virology", '1', '2024-10-02 10:32:20', '79ba6f52-4db5-4dd3-8df8-e701f697fb16'),
    ('37', "Rheumatology", '1', '2024-10-02 10:32:20', '8476c130-4f1d-44cf-ad74-7cbdc3fbd05c'),
    ('38', "Hematology", '1', '2024-10-02 10:32:20', 'd62b9b31-14f0-4781-8b97-27161e1fe9c3');


insert into concept (`concept_id`, `short_name`,`description`,`datatype_id`,`class_id`,`creator`,`date_created`, `Uuid`) 
values 
    ('2001', "ECH",	'Ultrasound imaging to view internal organs.', '52', '31', '1', '2024-10-02 10:32:20', 'd72ad156-7e00-4d7e-9d78-3e9079a656ad');

insert into concept_name (`concept_name_id` ,`concept_id`, `name`,`locale`,`creator`,`date_created`, `concept_name_type`, `uuid`) 
values 
    ('2001', '2001','Echography', "en", '1', '2024-10-02 10:32:20', 'FULLY_SPECIFIED', '377cadc5-a517-4cef-9ac2-5d5a07bce4ab'),
    ('2002', '2001', "Echographie", "fr", '1', '2024-10-02 10:32:20', 'FULLY_SPECIFIED', '4949186d-8f3f-46c2-b418-e026089d7f25');