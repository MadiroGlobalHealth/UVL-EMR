-- #455: stock items for the drugs the product owner confirmed on 22 Oct 2026 that have none yet.
--
-- Run by the changeset add_stock_items_catalogue_alignment-20261023 in ../liquibase.xml, which
-- only runs once every drug and unit below exists. Two sources, both in catalogue_alignment.csv
-- next to this file: the catalogue lines of sheet 1 matched to an existing drug, and the drugs
-- prescribed in OpenMRS that are not in the catalogue (sheet 2, all stocked). The 6 drugs created
-- by #455 are in stock_items_new_drugs.sql, which waits for the drugs domain on its own.
--
-- Same shape as sql/stock_items.sql (#437): the drug and its concept, PHARMACEUTICAL, one
-- packaging unit at factor 1 that is both the dispensing and the default operations unit, batch
-- and expiry tracked (#454), no batches and no quantities. The unit is the pack unit the product
-- owner uses in sheet 3 (Flacon, Comprimé, Gélule, Ampoule, Tube, Ovule, Baxter, Pièce); these
-- drugs are not in sheet 3, so it follows from their form the way sheet 3 does (the column
-- unit_source of catalogue_alignment.csv says how).
--
-- Idempotent: a drug that already has a stock item, or a row whose uuid exists, is skipped. The
-- uuids are uuid5 of the drug uuid in the #437 namespace, as in stock_items.sql.

CREATE TEMPORARY TABLE uvl_stock_item_seed (
    drug_uuid CHAR(38) NOT NULL,
    dispensing_unit_uuid CHAR(38) NOT NULL,
    has_expiration TINYINT(1) NOT NULL,
    stock_item_uuid CHAR(38) NOT NULL,
    packaging_uom_uuid CHAR(38) NOT NULL
);

INSERT INTO uvl_stock_item_seed (drug_uuid, dispensing_unit_uuid, has_expiration, stock_item_uuid, packaging_uom_uuid) VALUES
    ('1b236044-7df7-488c-958d-b83b642a24e7', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, 'b8bc7b74-a56a-5201-a2d9-116011060784', '6b1131c4-a4d5-5bd5-8724-2fda69e0adf2'), -- Acefen Comprimé 100mg | Comprimé
    ('e9d0579d-65b5-4214-8dd0-757b2cf76153', '2867b8c2-53d1-41cd-a1e9-aad3b1789712', 1, '6cf8e8d2-09f6-577a-b6ef-cac43b9fb9e7', 'b6de90c2-5fbb-5b4f-86a6-789250481ca1'), -- Algesal Suractive 6,54 %/3,46 %/1 % Tube 40g | Tube
    ('c0b992fd-cc53-4b51-a77f-7908634b5d12', '04144d11-cfed-4930-8ffc-f1b8be92440b', 1, '578c0ecc-2480-5c17-9535-13b83f2cf5f3', '05bebf4f-71f2-5373-b61a-9334e00d8e7b'), -- Amoxicillin+Acide Clavulanique 1g/200mg Injection | Flacon
    ('54f24ddc-2a49-49bf-931e-f437ba1507e1', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, '249328b0-bccb-5e0f-a6c2-362d6ad0b9ea', 'e9e3b517-5e11-5e0c-9aea-64a4beee2e65'), -- Amoxicillin+Clavulanic Acid 500/62.5mg Comprimé | Comprimé
    ('ffeaf200-5288-41c6-9754-e0e310d83273', '94b2f0e7-0885-430f-8733-e2a93f03095d', 1, '90c3f759-620f-517a-82fc-97f3cb12e3b0', '27bb0ec4-fc55-5bb3-8884-f0d94649197c'), -- Amoxicillin/Flucloxacillin 250mg Capsule | Gélule
    ('4165a730-89e3-47bb-a3e2-ba523771dce0', '04144d11-cfed-4930-8ffc-f1b8be92440b', 1, 'bf3931ac-db30-5362-a92b-bf043980bc66', 'f3bdd654-b05e-5e33-b440-86fdb92208a1'), -- Amoxicillin Sirop 250mg/5ml 80ml | Flacon
    ('e3a6020f-5693-464e-941c-0d13e8ab6ed5', '04144d11-cfed-4930-8ffc-f1b8be92440b', 1, '8b0201ef-5d83-5d4d-afcd-486ab665f95e', 'dd930b65-3dd5-5298-8597-9f6570b1c0ab'), -- Amoxicillin Suspension 125mg/5ml 60ml | Flacon
    ('5a45d516-4cf9-4393-9c41-d659084ca491', '04144d11-cfed-4930-8ffc-f1b8be92440b', 1, 'e217acfc-3811-59a4-be77-815167af5e4d', '69c67743-40d2-5d1b-b897-cdf7825224ab'), -- Amoxicillin Suspension 250mg/5ml 100ml | Flacon
    ('25ef1ac8-f926-4ff8-af12-d4317b06f9b7', '94b2f0e7-0885-430f-8733-e2a93f03095d', 1, 'f85d5512-2425-5694-8c49-3b9c60a732a5', 'a77b1f98-78df-55e8-9d61-becf0989292b'), -- Amoxicilline Gélule 500mg | Gélule
    ('072054ee-b1d3-433b-9808-b4a29f482e63', '04144d11-cfed-4930-8ffc-f1b8be92440b', 1, 'd917866b-df04-5c18-9954-60ec074864af', 'b241f448-4f59-5763-becb-6ec65a25b873'), -- Amoxicilline Sirop 125mg/5ml | Flacon
    ('1cca586a-cf7d-4076-a9c1-d18b80914e92', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, 'f61fbfe7-0561-5e9d-9efc-b01f59ef46a9', '1fe9e5e7-3481-5680-bd8a-67e732155f29'), -- Artéméther-Luméfantrine Comprimé Boîte de 12 | Comprimé
    ('d337d23d-a300-4f1a-b151-34c3b7f0d740', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, '362c8502-c81d-5534-9433-850e3fb5b3ad', '3917353c-3ea9-5ce4-a441-70242db83ed7'), -- Artéméther-Luméfantrine Comprimé Boîte de 18 | Comprimé
    ('65d1e9c2-7424-4df3-bd64-211143d0f1c3', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, '0f415b12-003b-59dc-8539-0d31f6e69996', 'faf930f5-aa84-50bd-9efb-f5696de9612b'), -- Artéméther-Luméfantrine Comprimé Boîte de 24 | Comprimé
    ('d568c612-69ee-4e7f-b49c-f810cc0a43cd', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, 'b584f92f-be86-529c-9fe0-8ac7a61efc65', '91f70f05-3386-52e7-9a32-0e5aa6de0629'), -- Artéméther-Luméfantrine Comprimé Boîte de 6 | Comprimé
    ('245628ce-af36-40b9-bcef-7555e5b3e627', '94b2f0e7-0885-430f-8733-e2a93f03095d', 1, '95d5c930-d349-562e-b6e8-d981e21ea3d9', 'd2422516-94f2-5eba-8d91-5451302754f9'), -- Astaph Capsule 500mg | Gélule
    ('5d9220a1-65d8-4b6f-be9e-7d373810dafe', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, '50bf9ad4-9afe-59f3-b8d2-f201cf7e3a0d', 'e247ad92-a778-5d2b-a459-aaf06248160b'), -- Ataktan Comprimé 100mg | Comprimé
    ('e012215b-6498-42c5-b70b-59d7efd2e61f', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, 'b8925328-4c43-5c66-bdc0-3233d74cc706', 'c4b9d037-0aae-513f-9c74-e7c58a22ccb5'), -- Atarax Comprimé 25mg | Comprimé
    ('a1113e6c-13c4-4fe0-ae01-9ffe57805805', '04144d11-cfed-4930-8ffc-f1b8be92440b', 1, '66994b59-beba-545d-944f-659e9c34164f', 'ba1afde3-380f-5e39-9f89-23af9b08e0ba'), -- Azithromycine Sirop 200mg/5ml 15ml | Flacon
    ('f275b7ef-42cd-4be8-8269-05ed96ace01e', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, '8a7c659c-2143-51d3-9625-3337fb71a122', '5dcc2e7c-ecfc-5a3b-af2e-90509672b3ca'), -- Betrozole Comprimé 30mg | Comprimé
    ('362e76bc-bb0e-4fc8-9b14-6938e04fbd4a', '04144d11-cfed-4930-8ffc-f1b8be92440b', 1, 'ab3a317a-162b-54fe-90f5-8464190e8fb3', '5827e781-fd4f-5dd7-ad81-3ad13e3be23a'), -- Bromhexine Sirop 4mg/5ml 100ml | Flacon
    ('cb3f13b3-4c69-4462-b3b9-07690ae7ce86', '04144d11-cfed-4930-8ffc-f1b8be92440b', 1, '564bc84d-9d4a-571a-a08f-775e2d14a56c', '2eb7872f-2d0a-5cda-a73b-44052cd00959'), -- Bronchathiol Sirop 0.05% 150ml | Flacon
    ('786bee02-faf2-4041-9601-9f3a8b975651', 'ad460f3a-0eec-54db-95a1-d358b8fa3a51', 1, '13759033-9512-5ee1-8c9c-2396464e4c86', '28e0a622-ca5d-5dbc-8c53-22e9aab50352'), -- Candid V3 Comprimé vaginal 200mg | Ovule
    ('0ff4bd85-b243-472d-a35b-13e33fc62219', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, '73073217-3e5b-5faf-a38a-a7d85b67b9ad', '5d2932cc-7006-56e5-be73-7c7ba18777a3'), -- Captopril Comprimé 25mg | Comprimé
    ('8dadaa53-bc90-4b0e-8967-a850599c7f37', '04144d11-cfed-4930-8ffc-f1b8be92440b', 1, '4280bbf2-7985-55c1-a8b9-f926af7fc3a2', '8f35ee81-a36e-5d02-bb16-e2723bece160'), -- Carbosol Collyre | Flacon
    ('6fd05b9d-3a0e-4cf0-91c8-aa94dbbdac10', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, 'e3057446-a873-5298-a955-5b950c0f1987', 'c9e65291-813b-5423-affe-db628ba7b14a'), -- Cardiurine Comprimé 50mg/25mg | Comprimé
    ('789f3f90-5529-409d-b6aa-3841c823f3d9', '04144d11-cfed-4930-8ffc-f1b8be92440b', 1, '29421eef-d385-59ac-a31b-343ca68fe11c', '1cd56e34-3b32-58a7-841a-d9021aa7f511'), -- Céfotaxime Injectable 1g | Flacon
    ('6ccb5987-3bea-41c6-9376-e5f9f02de369', '04144d11-cfed-4930-8ffc-f1b8be92440b', 1, 'e7d2802a-f441-5279-931e-9f99c3e46e49', 'd0740f57-41dc-5de2-b84a-8d599d917abc'), -- Cetirizine Sirop 10mg/ml | Flacon
    ('d2ebc592-3ebe-4a44-b374-32c82745069e', '04144d11-cfed-4930-8ffc-f1b8be92440b', 1, 'ee09b34b-c28f-5d71-ba47-2f09416bdd85', '05b12c40-7382-5775-9c9b-3eb05aab9636'), -- Chibro Cadron Collyre | Flacon
    ('2331b3f7-e97f-41b6-99f5-d29a16d2d230', '04144d11-cfed-4930-8ffc-f1b8be92440b', 1, 'b14fb7e9-12d9-57e6-b25d-88d34369cf0e', 'bfb6d8da-b204-52c6-85c7-e54d5e212388'), -- Chloramphenicol Suspension 125mg/5ml 60ml | Flacon
    ('f38172a5-e63b-4edd-82f8-171d48ca20d8', '04144d11-cfed-4930-8ffc-f1b8be92440b', 1, 'b669f161-239e-54df-9d5e-cc58ac2d20a8', '75144221-c539-5c7b-80aa-6bf4977bff7e'), -- Chlorpheniramine Sirop 2mg/5ml | Flacon
    ('50edd29c-2e36-4a1a-97e8-ba0dc656aee0', '7f4638f9-17fe-5bf4-83c5-8a2eff7d54dc', 1, 'f4bab4d8-9d06-56c3-b817-563486f65862', '06175bb5-8ead-5321-aae0-3cd8bdf413a3'), -- Chlorure de sodium | Baxter
    ('1465c189-a180-45aa-baef-92e784200d65', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, '9093112c-b65a-5a7a-b11f-37a135f824fa', 'a9f79db0-e4fd-5875-89ad-211f8eb51e6f'), -- Ciprofloxacine Comprimé 250mg | Comprimé
    ('87ab3604-95f3-47fd-9c2e-c12bb64c4b77', 'd81e10fe-0f6a-4b75-b9c0-a5e72d56f3b2', 1, 'a1b716b0-afbb-58b7-b287-cba2e383173e', '5efcc643-712e-508b-aa13-f03a8aa1105e'), -- Clonidine Injectable 0,15mg/ml | Ampoule
    ('7e5698a1-a926-4a2f-ab28-47c413c5a4b8', 'd81e10fe-0f6a-4b75-b9c0-a5e72d56f3b2', 1, 'ec9fe8b3-f452-54ff-b947-9e0cfb816680', 'b10ea55b-1bb9-565b-aafc-05f907e4407f'), -- Clonidine Injection | Ampoule
    ('18f38708-0f59-442a-b545-4a767e901534', '2867b8c2-53d1-41cd-a1e9-aad3b1789712', 1, '38c67ece-c8f0-5fb9-b89d-8fdfde5de7e2', 'd4d40620-1b8d-5b3f-b343-50a7aa718f78'), -- Clotrine B Crème | Tube
    ('fe72403a-4b29-4673-babd-23b7e464e9b1', '2867b8c2-53d1-41cd-a1e9-aad3b1789712', 1, 'bc9c843e-961d-5ebc-a953-67700ff4075e', 'aa4fff5e-a867-5594-a21e-3fc2c21cca1f'), -- Clotrine BG Crème | Tube
    ('86ee5756-be99-4cf1-bd07-64ae58072376', 'ad460f3a-0eec-54db-95a1-d358b8fa3a51', 1, '032da618-57ac-5eb1-9b4c-3b90bb8a8f2c', 'd883f2c0-8178-587d-8b61-c59253e63a67'), -- Clotrine Ovule | Ovule
    ('5b49f421-fdc2-4ff8-b688-6cf912c34236', '94b2f0e7-0885-430f-8733-e2a93f03095d', 1, '75919d17-ead7-528e-aece-fdab36c40fc0', '1af5e6e5-9f12-5c90-8c7c-3a155caae155'), -- Cloxacillin Gel | Gélule
    ('688b604b-ee59-4486-883e-3b3ba4622609', '04144d11-cfed-4930-8ffc-f1b8be92440b', 1, '49da14d3-0c89-5a64-9bb3-63fdf1c937ad', '4e56ca2a-6ff0-524f-9453-78261169a56b'), -- Cloxacilline Sirop 125mg/5ml 100ml | Flacon
    ('331aa9d0-83cb-4206-a49e-f20bd09f4566', '04144d11-cfed-4930-8ffc-f1b8be92440b', 1, 'a69e09cb-56db-53c5-b7a1-4d7cf71edea7', '162ad165-af34-5791-82c1-00d95c6f8316'), -- Cloxacilline Sirop 250mg/5ml 100ml | Flacon
    ('0d69879e-1b29-4286-816d-024a63180d57', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, '0ec4af44-3536-539c-8d65-832a5e5e4d2d', 'ba9f64cc-1397-5470-a056-a2a5c4384e68'), -- Cotrimoxazole Comprimé | Comprimé
    ('b0e044fb-8a54-4d16-9fc3-502c11b22c2c', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, '580f7827-028b-5022-8ee3-16ee78ebace4', 'e0ab4bec-1d4b-54c2-b640-380543ca5f2b'), -- Cotrimoxazole Comprimé 80/400mg | Comprimé
    ('ebaca3cf-8c36-48a5-8456-737906180e78', '04144d11-cfed-4930-8ffc-f1b8be92440b', 1, '6030dea3-da56-5295-9ad3-f97d55dfc0df', 'b3978785-a6e9-5c82-9baa-249095981618'), -- Cotrimoxazole Suspension 240mg/5ml 100ml | Flacon
    ('241df482-d756-404b-987c-4a080ac53c73', '2867b8c2-53d1-41cd-a1e9-aad3b1789712', 1, '95140e05-e004-5fc6-b232-6057c4539817', '894d43dd-db2c-51a6-94a3-4e953667a34c'), -- Crème de Miconazole 20g | Tube
    ('91f37030-c050-4964-a3d7-051763090bf2', '94b2f0e7-0885-430f-8733-e2a93f03095d', 1, '98bac5eb-b47c-59b7-96b2-7033c4eed7c6', '81449b58-da7b-5386-b040-9cce1f8bbe3f'), -- Dafrazol Capsule 20mg | Gélule
    ('da50d14b-6d8a-43ca-ae82-dfe43dcb1fdd', '04144d11-cfed-4930-8ffc-f1b8be92440b', 1, '023e6bf4-12e3-5d8d-a8db-dfb391a0ec2a', 'ba9d9e14-d174-5ebb-a877-6668de1ea789'), -- Depakine Sirop 200mg/5ml 150ml | Flacon
    ('ac7c10ed-19e1-4784-9a95-cb2f9ea71d8a', 'd81e10fe-0f6a-4b75-b9c0-a5e72d56f3b2', 1, '8769b00a-9e5d-575b-a49a-a66e1faa01c5', 'ac2b6077-5528-5bb3-ac2f-6dbbe3ebbb51'), -- Dexaméthasone Injectable 4mg/ml | Ampoule
    ('58000c77-00ec-408f-883b-0c0412c54bb6', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, '9f628a44-24a1-55fd-aa98-ef1f7934a087', '74678222-d210-52bf-bb59-4ee2b0917e05'), -- Diazepam Comprimé 5mg | Comprimé
    ('728b1639-8d38-44ca-b3e8-ba33eb09631e', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, '8f8ba3cc-73c2-56fb-8ea1-2317ee567704', '969fbba7-abbb-52ae-9775-29c0d9d76b35'), -- Diclofenac Comprimé 100mg | Comprimé
    ('afec8e63-860d-48dd-b143-55fc21bd1967', '2867b8c2-53d1-41cd-a1e9-aad3b1789712', 1, '05d62e0f-0253-52d1-ac25-30eacca2d759', '4969ed33-a479-5b43-8328-618033910ff8'), -- Diclofenac Pommade 0,01% 30g | Tube
    ('596e6322-20d8-487d-8416-f0fe67d8386f', '2867b8c2-53d1-41cd-a1e9-aad3b1789712', 1, '3d74f426-559b-5fc9-a4f7-eb543f8cc213', 'a1b629be-a2b0-53df-8eb3-fcefb013db73'), -- Diclofenac Pommade 20g | Tube
    ('ee7f0744-9fcc-47d1-99b2-8b97860c6b79', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, '70e17596-7ef5-568b-a270-cf27f90cddde', 'e27d01c6-372a-55e5-8869-0ab3fabe24e6'), -- Diclofenac Retard Comprimé 100mg | Comprimé
    ('75264f61-a28e-4670-aa0c-1fdaf148207e', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, '74cf1542-770f-58df-b93a-311e9386993c', '9e6cc0de-4f9f-5da6-b4d2-a525b6596fd0'), -- Dicytam Comprimé 500mg | Comprimé
    ('7fe7b391-0095-4005-b2e4-c64e890dc548', 'd81e10fe-0f6a-4b75-b9c0-a5e72d56f3b2', 1, 'dfc5c05b-f5b9-5278-84c7-b26fdcf04dfc', '1a2e4cfe-d870-5895-aa5b-bcbb3d87e171'), -- Dipyrone Injection 1g/2ml | Ampoule
    ('4a89fb08-6005-4be1-9f97-a4ec5c220dda', 'd81e10fe-0f6a-4b75-b9c0-a5e72d56f3b2', 1, '68436841-1859-5441-ad6b-3643205c317a', 'a51ed5d8-26dc-561b-b8a3-1cbffaef686d'), -- Dipyrone Injection 2.5g/5ml | Ampoule
    ('1da6a789-fff0-4ae2-926f-5a9cb3795311', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, '8474c25b-f0a1-564a-94a7-ad0507fe10f8', '6c6a0a4d-9684-518c-a758-17d365077d2d'), -- Dompéridone Comprimé 100mg | Comprimé
    ('6b6d5453-c931-4c9a-93d2-57019057ef25', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, '59630fa9-0fd0-5d9b-83ad-c7bcf89dda52', 'ebb4300f-1645-5c50-a18c-3a529d9ded70'), -- Doxycycline Comprimé 100mg | Comprimé
    ('43f0af98-cd9f-4baa-99b1-75f56fcf84d7', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, '116ade52-860e-50d9-9779-fabb5c153ad4', 'c5fdf64e-d280-5013-918f-1dc66d0a67a6'), -- Doxycycline Comprimé 200mg | Comprimé
    ('9b95b450-bace-4eb8-a665-7b7ce93cef07', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, 'af435f34-4220-53bf-a2cb-07d36b3a3bd5', 'b33fa38e-4869-55cb-8613-9ef2e0b92c02'), -- Duphaston Comprimé 100mg | Comprimé
    ('c4a86f97-688f-478c-942e-97afa0ca2d54', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, '946cdf8a-e410-564c-b65b-e94a9001a2d1', 'e2077f64-2bf6-5ca9-8f06-541281aa6446'), -- Duphaston Comprimé 10mg | Comprimé
    ('9c2c5a67-a300-4f57-ab28-dfaab8edd6b3', '04144d11-cfed-4930-8ffc-f1b8be92440b', 1, 'c81da5e3-9e70-5388-bf03-821b432b2e27', '541e21ce-01b4-5aa2-b24a-63dac37b14c6'), -- Eau Distillée Flacon 10ml | Flacon
    ('2a84e0ae-caaf-434e-baca-8ed1baf5adb3', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, '6737e4e8-717c-5bc8-9075-826281411cb6', '18e720f9-95f5-5865-afb6-89f5d543aba7'), -- Efferalgan Comprimé 500mg | Comprimé
    ('6b561480-3352-46c8-a54c-4d0c5999aef6', 'c4b6c7b7-4906-4f76-af51-60ec9a34932e', 1, '785b8eb8-2636-5694-8f90-24de08b47eba', '0763931f-8e9f-5691-974c-8780742fc06e'), -- Flacon à selles | Pièce
    ('2ec9e0d1-e89c-4da8-9cf8-8a7ffa1300c5', '04144d11-cfed-4930-8ffc-f1b8be92440b', 1, '1243b255-7a46-5eb1-b85e-a522690793c7', '2a70ffcf-4055-570a-878f-5c477dd0cdcc'), -- Fluditec Sirop 2% | Flacon
    ('a3bb95b7-158c-4568-b17b-877b2e0d65a1', '04144d11-cfed-4930-8ffc-f1b8be92440b', 1, 'b0664a45-12d9-5e14-9343-3e9a1598c524', '2b77a634-5320-5862-99c8-0b9a94cc64a5'), -- Fluditec Sirop 5% | Flacon
    ('163a4146-4b54-48b1-ac0c-96f7e053916b', '2867b8c2-53d1-41cd-a1e9-aad3b1789712', 1, 'c6cdd3ac-01b6-539e-9aa8-f16b11594e95', '18c89ed3-f55f-587f-8e19-fb54abc778ea'), -- Fucidin Crème 0,02% Tube 15g | Tube
    ('35ee19da-c333-411a-8936-a5fd4561ef7d', '04144d11-cfed-4930-8ffc-f1b8be92440b', 1, '6fb7180c-0705-52a7-9a9f-36d08215798f', '9de7f559-8d44-58d7-825b-2a8fce5f2c05'), -- Fucidin Suspension 250mg/5ml 90ml | Flacon
    ('913a6fe5-0727-4b9f-9269-bc83f0c7d7a2', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, '5dd23248-8ca1-5e67-ae15-dadad622b0c1', '3df3c9e4-f38b-575f-aadd-9281296f41a8'), -- Furosémide Comprimé 40mg | Comprimé
    ('77317d9a-9f31-4b9b-8aff-fa8ad59b61d1', 'd81e10fe-0f6a-4b75-b9c0-a5e72d56f3b2', 1, '87820734-1f95-5b0e-9ee7-05c32c1073dd', 'ed6f31fc-68bf-561c-9e66-5497281983e6'), -- Furosémide Injectable 10mg/ml | Ampoule
    ('c77ccb7d-2612-439d-8216-ca9f3ca22a16', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, 'ca404b26-2f9b-5241-8e10-75b5fa10da72', '18ef5b1f-757d-5bf5-a123-e6dfe3bd5b3a'), -- Gamalate B6 Comprimé | Comprimé
    ('200cf098-d019-47f1-865f-7ec9099d49be', '04144d11-cfed-4930-8ffc-f1b8be92440b', 1, '568235bc-fa46-512b-8122-c25700a4a60d', '6cc2d710-4fd8-5803-b2f4-4ad82b44a51d'), -- Gel Larmes Collyre | Flacon
    ('960eba46-585a-4763-b74b-c08996899af1', '04144d11-cfed-4930-8ffc-f1b8be92440b', 1, '7d822a6c-6c09-5aeb-9e32-42866cff932f', '4f21907e-4dd0-5af7-9b5a-23abc4a4f007'), -- Gentalline Gouttes Ophtalmiques 0.3% 5ml | Flacon
    ('2b6bf939-8f96-4171-8eee-b454199133b8', 'd81e10fe-0f6a-4b75-b9c0-a5e72d56f3b2', 1, '29de090c-a791-5d62-977f-f5731bf31f66', 'df0eaf13-fac6-55e3-902a-87da6dc1afb2'), -- Gentamicin Injection 40mg/2ml | Ampoule
    ('b0a2cd9f-12bf-4d49-bed3-aa2ba4f6e2bc', '04144d11-cfed-4930-8ffc-f1b8be92440b', 1, '658320b4-0e84-5e89-b2ba-70c68425077a', '0548b557-e305-5dad-99cb-9bc13f1d6442'), -- Gentamicine Collyre | Flacon
    ('5eac7195-bd6e-42f2-9fc6-bfe314f2d92a', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, '1a49dce7-7c59-5662-aa6d-b93ab00e4e75', 'e873ce57-f8e2-50ad-ab31-40ae859d1bcd'), -- Glibenclamide Comprimé 5mg | Comprimé
    ('675545bd-76f0-45bf-a575-a79edc578f36', '7f4638f9-17fe-5bf4-83c5-8a2eff7d54dc', 1, 'b058d268-ea55-5670-9b68-aab401d768ee', '9ebfc70d-d118-506b-ada2-8f70a33f42c0'), -- Glucose 10% Solution 500ml | Baxter
    ('58fe137b-5b34-4ba0-ae2f-49793434e603', '7f4638f9-17fe-5bf4-83c5-8a2eff7d54dc', 1, '4e695eef-0a42-515f-9afe-405260207a9a', 'bc738e07-923f-5d43-a603-ec80835b1a73'), -- Glucose 5% Solution 500ml | Baxter
    ('edb36207-2e2c-4e56-b8f4-199b130445c8', '7f4638f9-17fe-5bf4-83c5-8a2eff7d54dc', 1, 'e86e0496-8f66-57eb-8458-f5cd82349251', '358eff55-10cc-5f5d-add8-5abc0715ac53'), -- Haemacel Solution 500ml | Baxter
    ('3cc8ca86-64b1-4b39-bbd2-0a64197d70ce', 'd81e10fe-0f6a-4b75-b9c0-a5e72d56f3b2', 1, '9796288e-8431-5867-8216-06996fb2fcb4', '05a58a3e-ef4b-5634-9a43-5e62ca9e50e2'), -- Hyoscine (Buscopan) Injectable 20mg | Ampoule
    ('a5890a9b-ce92-44a9-a929-b33709bd5d8a', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, '920b82f5-d3d0-5f81-8e55-36c7ca7c2e48', '1724b789-4bc3-5eed-b634-3fee0e288f4c'), -- Hyoscine Comprimé 10mg | Comprimé
    ('30d8f5ce-89ba-4805-8d80-e3571ca38ba2', '04144d11-cfed-4930-8ffc-f1b8be92440b', 1, 'e1abef4d-5486-51b2-b957-10a5ea7c9ac6', '453da03a-3a4a-5e02-917b-cb036dba6a55'), -- Ibuprofen Suspension 100mg/5ml 100ml | Flacon
    ('c848954c-078b-4ad3-8fcb-114f27c9c43d', '04144d11-cfed-4930-8ffc-f1b8be92440b', 1, 'fac83fb5-2b19-5905-b022-8530ab7cd1f9', '1ead54b2-f630-50dc-a5c2-d816da4a914c'), -- Ibuprofen Suspension 100mg/5ml 60ml | Flacon
    ('c273b18a-8e47-45f2-ac39-352e96ad68c7', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, '79b7c765-1b91-59b8-8f2e-c03259fe6261', 'ff941b2f-ed0b-51d2-a5d0-b2ffcf426ad9'), -- Ibuprofène Comprimé 400mg | Comprimé
    ('fd74b4d5-db14-466e-bea8-e211e655dcf7', 'd81e10fe-0f6a-4b75-b9c0-a5e72d56f3b2', 1, '37ff9e44-0689-559b-a9e1-53c4367dc894', '4798a725-3c10-5ee4-bd49-472e935b1563'), -- Injection de Vitamine K 10mg | Ampoule
    ('0b273e54-5dc0-4718-ac57-6c13dcbb961d', '94b2f0e7-0885-430f-8733-e2a93f03095d', 1, '9e8cb4ec-38f6-53e1-bc26-35d5b06950ce', '85943bac-0b03-5c3e-b1ca-26d201a0b67c'), -- Kemoxyl+F Capsule 250/250mg | Gélule
    ('634b366d-213a-467e-98c6-59a5e61af715', '94b2f0e7-0885-430f-8733-e2a93f03095d', 1, 'bb26d41b-5090-5ac3-8d14-c8e15bcf0e37', 'df2667d7-3712-5a5b-a01c-58c9302d75cf'), -- Kemoxyl+F Capsule 500mg | Gélule
    ('c72a6b80-8c81-4450-b02e-87d8b4cdae46', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, 'b6009762-b5fe-5191-a39f-0dc857be56d4', '0032bd40-538c-5005-9b77-22ffcdb83c98'), -- Kemoxyl+F Comprimé 500mg | Comprimé
    ('82e09f5e-6fe4-42da-918a-a5abc1daa92c', '2867b8c2-53d1-41cd-a1e9-aad3b1789712', 1, '20b878ac-3fb0-598b-ab81-0b3ea4602407', '92bdde38-93c5-5c8d-840b-d131b1ab2b09'), -- Ketoconazole Crème 0,02% 15g | Tube
    ('0539c860-2b7d-4479-aae9-b4442e69c4a5', '04144d11-cfed-4930-8ffc-f1b8be92440b', 1, '86b00c6a-daa2-539d-8a47-cc504ea51ee6', '279e2895-1b17-5718-b1d9-6d01c3a51396'), -- Ketolac Collyre | Flacon
    ('9d2244bb-be72-4443-bf5e-001d0ae32d20', '04144d11-cfed-4930-8ffc-f1b8be92440b', 1, 'ce43e252-73be-538f-907b-f62d7b009152', '5205dff2-8983-5bdf-89b1-0bff8f3e3104'), -- Lidocaïne Injectable 2% | Flacon
    ('6694bb74-9c2f-4bf5-87fe-d90069b6c788', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, 'eb30bcb2-3917-563b-9f4f-f7f8b54847c8', '55bd7bb4-7c0e-50db-94c1-be7ae4d15542'), -- Loaktan Comprimé 50mg | Comprimé
    ('a7549fad-09d5-4a1d-a2f9-0d83aede10df', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, 'a58ff421-2f05-5171-98f8-518df9454255', '14923af4-b17b-5893-8797-a21a2c4e8f9b'), -- Loaktan-H Comprimé 50/12.5mg | Comprimé
    ('3b0bbf89-2ba1-42cc-b75b-f71df03747ad', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, 'a0aada86-d375-5a04-a67b-c4eabb8b4af3', 'a4bd8b24-fb72-5450-9d35-0d2d9de2de2a'), -- Metformin Comprimé 850mg | Comprimé
    ('3ed44baf-bae0-4484-907b-4fbeeec85c13', '2867b8c2-53d1-41cd-a1e9-aad3b1789712', 1, '1c76ad7e-0f73-50ef-bc1f-c90c4a5eae91', '22e90272-3493-585a-88f7-56fa0eeb1fc2'), -- Miconazole Crème 0.02% 15g | Tube
    ('473946b5-7a58-4f78-a3db-72eb6eac57e2', '2867b8c2-53d1-41cd-a1e9-aad3b1789712', 1, '4f6f76f8-87ea-5a4f-915a-670a648af8bd', '5424bba6-d111-57fc-9b45-4afaa14adfe5'), -- Micozal Crème 0,02% 15g | Tube
    ('c3426765-6b26-457f-adf3-d3d829f62e25', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, '6e8abaad-e731-5afd-9d3f-e96d503f4529', '360d1893-d0b7-5617-9400-b31fefffbe9f'), -- Neuro Forte Comprimé | Comprimé
    ('46076a0c-a67b-4d42-a96f-69bbd6de644c', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, '3adb0e84-9506-509e-ba79-71b254747b95', '974181ac-12fb-51b3-8e13-989a1bab174c'), -- Neurontin Comprimé 300mg | Comprimé
    ('007d8518-52a6-47e0-bf3e-61b208661c65', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, '4217d099-1211-54db-8f8c-06b1d4937461', '8d88ccf4-a5f8-5839-ad6b-5a3a6bf4e900'), -- Nifedipine Comprimé 10mg | Comprimé
    ('cef563d7-05c9-4804-8684-a75b35e3405f', '94b2f0e7-0885-430f-8733-e2a93f03095d', 1, '1e27d7e6-5caa-5cbb-aa86-2941f20439a8', 'ca52b690-1ce5-5162-89f9-3a84f7b217dd'), -- Omeprazole Gélule 20mg | Gélule
    ('f58db908-8343-4ed9-874a-840e6e606560', '04144d11-cfed-4930-8ffc-f1b8be92440b', 1, '07eb134a-cdd9-5e43-a7f4-9a55219fd66c', '56d4b0f2-bc3c-5ba9-b402-a136e5326cd3'), -- Paracétamol Injectable 1%W/V | Flacon
    ('2b25ef7c-d710-4c1d-bc5a-bd8e2e34133c', '04144d11-cfed-4930-8ffc-f1b8be92440b', 1, '1d1290ab-77b2-5a91-a7f9-3ddad71b27d3', 'b0b10563-969c-562a-8f39-25d7f5fc8e24'), -- Paracetamol Sirop 120mg/5ml | Flacon
    ('2b8d6e0a-9d9d-44c7-b9f2-36d2fc898bda', '04144d11-cfed-4930-8ffc-f1b8be92440b', 1, '5f026ee4-7080-550d-bf4f-ea3b1b54c650', 'f6788aaf-6b3e-54ec-ae7d-d96dadaaa395'), -- Paracétamol Sirop 125mg/5ml 100ml | Flacon
    ('12bcc620-d2d4-4968-a032-d956f893c90e', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, '23f2f175-1fd1-5dbf-a587-99ca45e8c7a7', '3eaaaa39-a366-5b84-9e0f-8813361d87b5'), -- Pénicilline Comprimé 250mg | Comprimé
    ('0d9c3538-b0ac-4aed-9508-49a6b342fd87', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, '930bdd24-30b6-5023-9680-267afb563027', '6c210e07-088b-581d-b96c-50eebab20bdf'), -- Pénicilline V Comprimé 250mg | Comprimé
    ('f5d2e03a-77d2-48d5-958d-ba5abba0c711', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, 'b3e25acf-86a1-5f2b-a9bb-3eaf5334fe7f', '0ed28ff1-62e0-515c-80f9-0ac60b6a241b'), -- Phenobarbital Comprimé 100mg | Comprimé
    ('2ddc56ea-ea59-4e6c-a7f2-db9555fcf2e5', '04144d11-cfed-4930-8ffc-f1b8be92440b', 1, '4b5943d9-9c8d-5589-bc04-576f112f08c8', 'bba4d7b7-f933-5ba6-acd9-ce1daa9a3722'), -- Relcer Gel Sirop | Flacon
    ('4d42b0b3-8c2a-43c7-bb13-a8df441debfe', '04144d11-cfed-4930-8ffc-f1b8be92440b', 1, 'db7e43b7-368f-5855-ad65-93e753949ba9', '1e23daa9-c052-5f0c-b75a-e0a868f07703'), -- Rexedine Bain de bouche 0,01 % 150 ml | Flacon
    ('410b3fde-c736-41a8-931d-5dd5550297d1', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, '42bf7c7b-2fee-5247-a9e3-02b3a323dd1a', '83a9d37c-c408-55a9-8795-5d8bc1aea88f'), -- Secnidazole Comprimé 1mg | Comprimé
    ('9685b6a5-0a16-454a-bcf1-cfee5a705312', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, 'efea44a9-307b-5c63-976b-2042590ed0d5', '8227e484-5051-5f0f-b0ff-11ac244e95ce'), -- Secnidazole Comprimé 500mg | Comprimé
    ('2610eccc-4e39-4a7f-81d0-f5b95c5874e2', 'd81e10fe-0f6a-4b75-b9c0-a5e72d56f3b2', 1, '029e7282-578b-51fa-adc3-d96e9eda1447', '50519265-9d5d-5e7e-aaea-226cca1599bb'), -- Sérum Antitétanique 1500UI Injection | Ampoule
    ('c3468a8f-ea19-4abf-9f0e-b318bd2f4e55', '04144d11-cfed-4930-8ffc-f1b8be92440b', 1, 'f2b1491d-54c8-52d0-b2de-a11a0b109edd', '8afb9efa-b0a7-5649-b66a-68cd00e17531'), -- Solution de Peroxyde d’Hydrogène 250ml | Flacon
    ('31b26b90-e8fe-47af-9771-86805f270fd7', '8f61152c-e4e4-4c27-9f31-b52fdfde4943', 1, '818ff61e-8c4c-52a5-a439-3a0ad48fafc7', '7fab9447-0298-51ab-8201-9204fddf84c1'), -- Solution de Réhydratation Orale Sachet | Sachet
    ('a334e047-7f89-4e4e-88f6-d99bb9ce1e26', '7f4638f9-17fe-5bf4-83c5-8a2eff7d54dc', 1, '85cd949f-ee7a-5264-b1cb-def63d0ef946', '7caeb2a9-6691-5885-b701-83da51c4b0fb'), -- Solution de Ringer Lactate 250ml | Baxter
    ('6b98dae0-246b-4348-a253-4647d6ba8717', '7f4638f9-17fe-5bf4-83c5-8a2eff7d54dc', 1, '20fbe556-caad-594f-8f30-856db2abe405', '0ef2066e-0d43-59fa-9aa2-f4bb091b861a'), -- Solution de Ringer Lactate 500ml | Baxter
    ('bb0121c5-b218-4917-88ce-949226160c53', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, '99922b01-d073-564f-b0bd-c1a922cf81bd', 'ea651453-455e-5262-82b6-88248d56b779'), -- Spasfon Comprimé 80mg | Comprimé
    ('871b78c8-6f21-4e45-b2dc-a5a7f8d0e6b9', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, '237b28fd-5bc5-58d7-a724-a648b6e3e470', '1bb16b1e-8f6c-5457-89cf-20d2d1dfffef'), -- Spasfon Lyoc Comprimé 80mg | Comprimé
    ('dde7cb81-78c6-4918-b307-a5902c2a2a74', 'd81e10fe-0f6a-4b75-b9c0-a5e72d56f3b2', 1, '60cea907-8799-5c02-adde-bf36202d90b1', 'aba8413d-556a-52b1-ada3-e71490e45a69'), -- Succinylcholine Injectable | Ampoule
    ('db7df9f0-3d00-4ace-8143-1254b7b674c2', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, 'da390d45-2f32-52c6-ad91-7eca2f02e09c', 'cdfc1054-fc37-5fa7-bdd4-a83917ba50b5'), -- Trialgic Comprimé 325/200/30mg | Comprimé
    ('634cc60c-29e1-45cc-b7a4-025682996acf', '04144d11-cfed-4930-8ffc-f1b8be92440b', 1, '8e5f4ca2-9d87-5ecf-825a-483628390bba', 'e19897d9-3a1d-5aa5-9c89-0cbd9a5af851'), -- Upacof Expectorant Flacon | Flacon
    ('e3661b89-123d-4946-96ea-791dc5b281cf', '04144d11-cfed-4930-8ffc-f1b8be92440b', 1, '3bfa0d93-583a-56f1-916b-e67c2bb66f24', 'f33247a1-7a20-5da9-9fa5-55a3c198a365'); -- Upacof Pédiatrique Sirop | Flacon

INSERT INTO stockmgmt_stock_item (drug_id, concept_id, item_type, is_drug, has_expiration, dispensing_unit_id,
                                  creator, date_created, voided, uuid)
SELECT d.drug_id, d.concept_id, 1, 1, s.has_expiration, u.concept_id, 1, NOW(), 0, s.stock_item_uuid
  FROM uvl_stock_item_seed s
  JOIN drug d ON d.uuid = s.drug_uuid
  JOIN concept u ON u.uuid = s.dispensing_unit_uuid
 WHERE NOT EXISTS (SELECT 1 FROM stockmgmt_stock_item si
                    WHERE si.drug_id = d.drug_id OR si.uuid = s.stock_item_uuid);

INSERT INTO stockmgmt_stock_item_packaging_uom (stock_item_id, packaging_uom_id, factor, creator, date_created, voided, uuid)
SELECT si.stock_item_id, si.dispensing_unit_id, 1, 1, NOW(), 0, s.packaging_uom_uuid
  FROM uvl_stock_item_seed s
  JOIN stockmgmt_stock_item si ON si.uuid = s.stock_item_uuid
 WHERE NOT EXISTS (SELECT 1 FROM stockmgmt_stock_item_packaging_uom p WHERE p.uuid = s.packaging_uom_uuid);

UPDATE stockmgmt_stock_item si
  JOIN uvl_stock_item_seed s ON s.stock_item_uuid = si.uuid
  JOIN stockmgmt_stock_item_packaging_uom p ON p.uuid = s.packaging_uom_uuid
   SET si.dispensing_unit_packaging_uom_id = p.stock_item_packaging_uom_id,
       si.default_stock_operations_uom_id = p.stock_item_packaging_uom_id
 WHERE si.dispensing_unit_packaging_uom_id IS NULL;

DROP TEMPORARY TABLE uvl_stock_item_seed;
