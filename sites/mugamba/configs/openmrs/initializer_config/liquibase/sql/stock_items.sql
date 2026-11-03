-- #437: the stock catalogue (Didier, 5 Oct 2026) as stockmanagement stock items.
--
-- Run by the changeset add_stock_items_from_catalogue-20261020 in ../liquibase.xml, which
-- only runs once every drug and unit below exists. Generated from the catalogue match: the
-- 166 medicine lines matched to one drug with confidence and the 40 consumable lines that
-- already exist as drugs (two pairs share a drug, so 38). The other lines were sent to
-- Didier, not loaded.
--
-- One row per drug, as the stock app would save it: the drug and its concept, PHARMACEUTICAL
-- (item_type 1, what the module sets for every drug-based item), one packaging unit at
-- factor 1 that is both the dispensing and the default operations unit. The dispensing unit
-- is the unit the drug is most often prescribed in (the dispensing app deducts the
-- prescription quantity as is); for a drug never prescribed, its dosage form. Medicines
-- track expiry, consumables do not. No batches and no quantities: every item is at 0 until
-- the pharmacy counts.
--
-- Idempotent: a drug that already has a stock item, or a row whose uuid exists, is skipped.

CREATE TEMPORARY TABLE uvl_stock_item_seed (
    drug_uuid CHAR(38) NOT NULL,
    dispensing_unit_uuid CHAR(38) NOT NULL,
    has_expiration TINYINT(1) NOT NULL,
    stock_item_uuid CHAR(38) NOT NULL,
    packaging_uom_uuid CHAR(38) NOT NULL
);

INSERT INTO uvl_stock_item_seed (drug_uuid, dispensing_unit_uuid, has_expiration, stock_item_uuid, packaging_uom_uuid) VALUES
    ('b4c1e2f0-d7ca-48a1-ac23-df85d30344be', 'd81e10fe-0f6a-4b75-b9c0-a5e72d56f3b2', 1, '46913567-9895-5d57-87a3-6de423bb9057', 'f1a5a6c2-9a25-5812-9bc2-b54516c3e378'), -- Acupan Injection 20mg | Ampoule(s)
    ('181e5888-94c1-466d-b49c-ab38e06d0927', 'd81e10fe-0f6a-4b75-b9c0-a5e72d56f3b2', 1, '800070ed-a4fa-55e4-9fd2-8131c4709613', 'b7d9c03d-fb8c-5717-ac7a-6c61997cf2e3'), -- Adrénaline Injection 1mg/ml | Ampoule(s)
    ('0bd56b8a-d8f6-4adf-bd66-d5e28450b715', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, 'e5a2dee9-eeeb-5e21-acf2-5568d5872a74', '3674d008-2bbc-5276-b33d-aeb1483da521'), -- Albendazole Comprimé 400mg | Comprimé
    ('c6a2b60d-5f85-4431-95c5-8597d8b17dd8', '04144d11-cfed-4930-8ffc-f1b8be92440b', 1, '6de3f19a-ae67-5872-9173-990f758ac795', '20cc98b4-9302-5703-9c6c-fc0de0150289'), -- Albendazole Suspension 200mg/5ml 10ml | Bouteille
    ('ad76c82c-7f96-4dbc-905a-163a75aa0be8', 'bf712910-1c7f-4e72-9d50-6eb5453efcfd', 1, '2171d539-1f37-521d-b83b-628dad97731a', '46901b0a-d14e-5bc3-860e-fce6fa8c73ae'), -- Ambrosal Sirop | Millilitre
    ('607e7ab9-15ff-4419-bc14-0d33a12233c4', 'bf712910-1c7f-4e72-9d50-6eb5453efcfd', 1, 'a67b2015-1d6f-5811-aaad-5ea3a92d73bd', '8fb9a0eb-2f09-568d-a0ff-cc6742496ab7'), -- Aminophylline Injection 250mg/10ml | Millilitre
    ('8a65d9d5-f488-42cc-a46a-f8f4d47a114e', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, '8f247f23-a17d-5b0a-9703-a0e8226ba2ed', 'c7f6f67e-b11a-5718-912a-5a7082cfa463'), -- Aminophylline Comprimé 100mg | Comprimé
    ('67900371-599c-42e7-953d-c553d996eaeb', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, 'e8c74756-4012-53e3-80ab-b04b844d7776', 'e2cdb299-95f4-5ec0-8b60-c4ecaf901921'), -- Aminosidine Comprimé 250mg | Comprimé
    ('f0dd0479-814d-4b0d-aa61-bfdb8f9dc2aa', 'c2beca4d-0e35-4989-8e9d-54134982bb37', 1, '8b9102db-9b8b-5f52-afa1-cda6dafb6059', '5c07235b-7aa4-54c9-873d-026148db9a97'), -- Ampicilline Injection 1g | Gramme
    ('66e2e474-83d0-47d4-9bad-e3f7edbc84d3', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, '22c6a89f-2adb-59ce-8d9b-b36bece35dc0', '1bee56b3-4eb5-5cbf-9dbf-6e00f9102d55'), -- Anamol Comprimé | Comprimé
    ('e33c1482-84d4-4ce6-ac44-7944bda93fcb', 'bf712910-1c7f-4e72-9d50-6eb5453efcfd', 1, 'd9738e95-bc17-5ff5-8353-d1394ea6895e', 'b6803ded-87dc-5d53-8743-2dd70cc62001'), -- Anamol Sirop | Millilitre
    ('af2cd1c2-ab22-406a-bf27-c809274880c0', '2befd840-e135-4fc9-bb9d-acdcce088f19', 1, '8a79d883-4029-52a4-bace-55fad090a61c', '3c668972-40a8-51a9-be2c-d18a0ceaacad'), -- Anginovag Spray 10ml | Aérosol
    ('65b267cb-b6cc-4d8b-8932-ae92c4d8f678', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, 'c0b49573-49d5-5b20-91f0-78f09c917e75', '3dcf96db-ee3b-5170-a80c-99156c18cad2'), -- Antalgex Comprimé | Comprimé
    ('1fb262b7-ae9e-45a8-8200-282239d52eee', 'd81e10fe-0f6a-4b75-b9c0-a5e72d56f3b2', 1, '94b42fce-1ee2-53da-b980-8d5edb275cd1', '421cc9b8-1472-593f-b8c4-b047d8aa8348'), -- Artésunate Injection | Ampoule(s)
    ('999343b4-e534-4618-8ca9-749237231906', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, 'd0fdecc1-0d5b-5efd-9f45-4717d92845e1', 'f02a326c-70a0-5427-af4a-16bb4be42e14'), -- Aténolol Comprimé 100mg | Comprimé
    ('08a8b7d6-a547-4fdc-829d-5102b17fbe13', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, 'a76a3e82-2494-59e7-938f-b0402c56f154', '8ddac974-f48e-55fd-867f-f5ffe3380752'), -- Aténolol Comprimé 50mg | Comprimé
    ('8b2f8b7c-0015-400b-aa9e-82ffd91cf518', 'd81e10fe-0f6a-4b75-b9c0-a5e72d56f3b2', 1, '466936f8-faaa-5618-ab1c-2cfc3fe94c6e', 'a7992e7c-8538-5ca4-8f3a-1c5062eacf99'), -- Atropine Injection | Ampoule(s)
    ('f9adb25d-d3b0-4729-8f8c-1d59e46d7c2a', '11ae7979-7bb6-49c7-9715-9adacc1b4005', 1, '44d84aee-a03a-543a-9d7e-68bac7e8bcd0', '6bfd2b90-e358-545a-a4c4-7f997777d352'), -- Aurocrome Collyre | Goutte (gtt)
    ('a486aafd-0805-49a7-82ec-16e77522309d', '11ae7979-7bb6-49c7-9715-9adacc1b4005', 1, 'b6d882d0-e442-5593-9be0-22c8dd6f0525', '8136db07-a31f-5b15-8583-940386b31175'), -- Auropred (Prednisolone) Collyre | Goutte (gtt)
    ('b0530ffb-abff-4a93-9455-38a6e40e0a94', '94b2f0e7-0885-430f-8733-e2a93f03095d', 1, 'b14153a5-cad5-57ec-9363-e887552ca319', '5e04f626-9c3e-503b-a87b-6c8a1b092e03'), -- Azithromycin Capsule 500mg | Gellule
    ('a4f28d5c-69fb-4a86-8f5c-6df7ad5f382c', '2befd840-e135-4fc9-bb9d-acdcce088f19', 1, '514a329d-70ee-5941-b274-f5e95ba0a76f', 'e03cca36-83b8-59b0-aeaf-9d8d64ac4a7b'), -- Beclo Asma Spray | Aérosol
    ('67920b61-0852-42ff-80d5-3aea13dc2a41', '835d9fa5-8807-4965-b7a3-1764a7d04eed', 1, '7e5c06e1-94f6-583b-8be2-ed5162a98e7f', 'fe89f042-2424-525a-839e-9c402286fa22'), -- Benzyl Benzoate Solution 0.25% 100ml | Conteneur
    ('8d52b68f-c7ad-40bc-b6aa-e6b31c7e6f8f', 'bf712910-1c7f-4e72-9d50-6eb5453efcfd', 1, 'b32333f3-17dd-5f52-9e6a-360391453a83', 'e2269e0a-0dfc-5b6f-ab6a-b79097d19d74'), -- Betastène Flacon | Millilitre
    ('d9845548-478b-4bee-ac4c-3613f5e770b7', '11ae7979-7bb6-49c7-9715-9adacc1b4005', 1, '822c96a9-1721-532c-9116-fcfb4d4c3d58', '805d4015-d76b-572f-a0df-6bf2d44047d7'), -- Biotyn Collyre | Goutte (gtt)
    ('eac394c4-9c20-4620-86fc-73c5fac60b2c', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, 'c152b0d2-3276-5e2d-8e66-f2c30894df7a', 'f9001069-c431-5ae5-a086-71d9610246d1'), -- Bi-Profenid LP Comprimé 100mg | Comprimé
    ('2d6e1e33-dc05-4dc8-8a60-7beb344a97cd', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, 'df8c503a-94b2-5394-aed3-4035a4d664f8', 'c59c6698-e996-565f-a076-eddeb293436f'), -- Bisacodyl Comprimé 5mg | Comprimé
    ('07abede2-40db-48fd-9e5e-5303bde643b6', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, 'cac5d2b6-a1a6-559e-a44c-6202cb8555f6', 'eca25e30-851c-5871-9633-e27cd72f8008'), -- Brufen Comprimé 400mg | Comprimé
    ('28bc265a-f73b-4a3f-983c-4f51967446bc', 'd81e10fe-0f6a-4b75-b9c0-a5e72d56f3b2', 1, '4ae08fc9-19d4-5f3e-87aa-9e02015d9118', 'b81858ed-f6dd-54f0-80ea-a1f2688a0f64'), -- Bupivacaïne Hyperbare Injection 20mg/4ml | Ampoule(s)
    ('8b97d618-af96-46a9-aa37-24f599cebcf4', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, 'ef547387-2f9e-5106-ba79-e35f8b8fd100', '6f57e872-39a3-5324-9d63-c4d5c0b164d5'), -- Calcium Comprimé 300mg | Comprimé
    ('b3d086dc-2bdd-4fad-b0b3-c58e96beb123', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, '9a298a93-cea9-538f-a3fd-eb858397b421', 'cac4f53e-d271-5e5b-bd3e-12142981e58b'), -- Calcium Comprimé 500mg | Comprimé
    ('f493d452-7b05-4934-ae81-835a1ce5c104', '835d9fa5-8807-4965-b7a3-1764a7d04eed', 1, 'f2dc1413-cf03-57d8-9801-511b883fb5c0', '8ee292a3-3dc9-5bf4-9e8b-350dfecec1bf'), -- Candiderm Crème 15g | Conteneur
    ('503f389c-adb2-45e6-ac1f-c4722e209380', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, '8c4803f4-6eb4-5892-9200-bf95438e8ede', '8430ae09-b912-547d-84bf-1e7334a7e764'), -- Cefixime Comprimé 400mg | Comprimé
    ('15a8e9d8-bf44-4e33-b3bc-f112d387998c', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, '345ed9ae-9ed0-567c-8af6-7e1cb5435b3a', '0ecff9bb-e9f3-5037-a8be-83064c4f1922'), -- Cefixime Comprimé 200mg | Comprimé
    ('6448b20c-b21a-4d78-92f5-8f99c3c07af6', 'bf712910-1c7f-4e72-9d50-6eb5453efcfd', 1, '6198c3c3-9df8-590e-98d1-1275b7d77899', '32e3adf3-d711-558e-9fac-92cf623261cd'), -- Cefixime Suspension 200mg | Millilitre
    ('1d67cc95-d786-435c-b974-201d2d3a5736', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, '5c9345cb-6137-5e84-a9aa-8b9f2df4acd9', '247f1bb7-d2a7-54fb-980d-d1d915453519'), -- Cetirizine Comprimé 10mg | Comprimé
    ('6991af07-a557-4326-acea-dfab522b4122', '94b2f0e7-0885-430f-8733-e2a93f03095d', 1, '44ea1840-c7a0-5f29-bd4f-df1c72a7772f', '805fd288-babd-516b-8ccd-076349bf84ab'), -- Chloramphénicol Gélule 250mg | Gellule
    ('d6d47995-7dcd-405c-980a-0a7b912095b4', 'bf712910-1c7f-4e72-9d50-6eb5453efcfd', 1, '933722fc-f384-5c7e-bdc6-35e63fec6b5a', '81f7f93a-bdaa-5271-9cdb-bc2e2c953967'), -- Chlorhexidine 1% Flacon 300ml | Millilitre
    ('27449fec-cce8-40c1-8b10-17324e40e186', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, '7af5abb7-99b8-5c35-a0b7-b8149ca81a43', '3e121d3d-9179-53b3-8f86-22addf475eb2'), -- Chlorpheniramine Comprime 4mg | Comprimé
    ('4b409061-15d6-4090-ac47-3c53aa73a618', 'bf712910-1c7f-4e72-9d50-6eb5453efcfd', 1, 'c8b8d121-716e-5652-adf7-c5a56d6ec6eb', '63d00d82-5c5f-554f-8c86-1d4240ca0652'), -- Cimetidine Injection 200mg/2ml | Millilitre
    ('e9788815-ab35-4ba0-83a9-8532c14c70c3', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, '84874e19-d8e8-5ed0-a3a1-3a0dd3bf6465', '94a71cfc-d632-5104-b9e5-91c5ec2eacd2'), -- Ciprofloxacin Comprimé 500mg | Comprimé
    ('ae77f97b-8ef9-4d15-a149-a16eb15a129d', '11ae7979-7bb6-49c7-9715-9adacc1b4005', 1, 'd45bb867-9850-5717-b4a3-f08da03742a8', 'aa3ac9e8-f91d-5288-a11f-017b385c0771'), -- Ciprofloxacin Collyre 0,3% 5ml | Goutte (gtt)
    ('3451c850-6fad-486c-814c-0ca6adf31095', 'bf712910-1c7f-4e72-9d50-6eb5453efcfd', 1, '28042cbc-2adf-5310-8bbf-8a10f9dfcbc5', 'b6392e27-2107-548d-9f04-f808975fb337'), -- Ciprofloxacin Injection 200mg/100ml | Millilitre
    ('ced4e98f-6415-400a-a24e-01e0338c5361', '11ae7979-7bb6-49c7-9715-9adacc1b4005', 1, 'a56539d7-554c-5f3b-8031-f0eefcbad003', '8a5c7d1a-be78-5077-b16a-0b2cb8c87273'), -- Ciptoxen-D Collyre 0.3% | Goutte (gtt)
    ('e818c162-80be-4e94-9fae-d40b06e3320a', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, 'c487ddc8-612e-505e-aec3-010c647beef3', 'eacbb41a-47d1-5911-b003-082607551cee'), -- Clavox Comprimé 500/125mg | Comprimé
    ('ec04e363-90df-4c57-ae28-1eec17516458', '04144d11-cfed-4930-8ffc-f1b8be92440b', 1, 'fcae15fa-055e-561f-9252-1495ee6edd16', '72255530-164a-5122-b223-217be07b90d9'), -- Clavox Suspension 200/28mg/5ml 70ml | Bouteille
    ('c21ebc1c-52a9-43e6-8033-125e25ce6d1d', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, '0eac3fdf-d248-5685-aa10-ed20bb2c9e51', 'e0f85f95-11c0-5660-bd68-e4eeba49fd9c'), -- Clofains Comprimé 500mg/50mg | Comprimé
    ('0bd2f601-2b2f-4aa3-907c-e80f2ee7e7f3', '94b2f0e7-0885-430f-8733-e2a93f03095d', 1, '514bf2c8-0b1e-55d7-ba40-d2c301c58dc1', '1840f47b-f633-5952-a8dc-bc8de9ed59cf'), -- Cloxacillin Capsule 500mg | Gellule
    ('93c9b10e-bcf8-458b-934a-a6ca52b406c9', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, '582dc67f-0546-56a1-a2f8-ec1c3111d5c7', 'a86f8a12-2b53-54ff-b401-0ce27c0baf54'), -- Colchicine Comprimé | Comprimé
    ('117f5875-d314-400d-bf53-c209ed67665b', 'bf712910-1c7f-4e72-9d50-6eb5453efcfd', 1, 'bb24db96-2601-59ec-b311-a3c5809c57ed', '5bb61123-3e59-56a0-a01f-6187d11f8c29'), -- Cold Cap Sirop | Millilitre
    ('2095ce6c-68a1-48a7-809e-a2e211d7b5dc', 'bf712910-1c7f-4e72-9d50-6eb5453efcfd', 1, 'b62e07b1-7cf4-51ec-9380-648ec06a1029', 'b4066b44-3ae5-50a9-8e1f-7e342e1ce1b0'), -- Contam Suspension 250mg/ml 60ml | Millilitre
    ('10436c22-3dbd-4ab5-95ce-85ad665e2ef6', '11ae7979-7bb6-49c7-9715-9adacc1b4005', 1, 'b47e6bb6-d090-5146-848c-b8017e3ec684', 'a6b26ce2-134b-5f9a-8514-6be28f314576'), -- Cromsol Gouttes Oculaires 0.02% 5ml | Goutte (gtt)
    ('d8c00222-7d85-465a-89bf-38108d4b449e', '11ae7979-7bb6-49c7-9715-9adacc1b4005', 1, '4db91674-0fd5-5cef-b0a3-c1fe42cb1c38', '6cc2a3be-5885-5fbd-9678-a2f5fc13d4be'), -- Cromulline Collyre 0.02% 5ml | Goutte (gtt)
    ('3a14b13c-0eae-4e18-b55e-02ae4b9226f7', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, '61947975-fd82-5df8-a3b3-da818843df17', 'f128852f-b47f-5e77-8b12-be42da13173d'), -- Depakine Comprimé 200mg | Comprimé
    ('63635c7e-dd5b-4374-8eec-17b68cc4297a', 'bf712910-1c7f-4e72-9d50-6eb5453efcfd', 1, 'c8e73d63-efee-5de8-a34e-0322e8de5465', '9b9c6443-076d-599f-a29b-5d59c36ae01b'), -- Dermobacter Flacon 125ml | Millilitre
    ('e860bbcf-6da7-403d-9482-0437d8fcf03b', '835d9fa5-8807-4965-b7a3-1764a7d04eed', 1, '78780aef-1bd3-570a-8ba0-0d8378afa15b', 'bb583581-360c-5667-86e1-2627dab60af4'), -- Dermobacter Solution 0,2 %/0,5 % 300 ml | Conteneur
    ('a7509e1d-cf0d-4563-91e7-ed80f49cb8d8', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, '4d536152-d935-503c-8db5-ffe949d7c6ed', '56d0ab81-fd49-55f6-9b92-f13cdea047b3'), -- Deslova Comprimé 5mg | Comprimé
    ('822e3388-e013-4efe-b452-fdeadfa09ff0', 'bf712910-1c7f-4e72-9d50-6eb5453efcfd', 1, '953db035-2439-51c0-a17e-ee5eabc7897d', '28271ab4-ab08-5685-bfbe-58d3a707d76d'), -- Deslova Sirop 2.5mg/5ml 60ml | Millilitre
    ('aba85f83-6de3-41f0-a090-3ffd43cab6d3', 'bf712910-1c7f-4e72-9d50-6eb5453efcfd', 1, 'd661baca-d6a3-5208-b33a-124881dca560', '9a44a4b6-c5c2-5c80-9593-33c535edebcd'), -- Dettol Solution 1L | Millilitre
    ('2e6e25dc-fb0a-402a-af74-367155459690', 'bf712910-1c7f-4e72-9d50-6eb5453efcfd', 1, 'fc5de89e-2bc6-51f7-a277-a3b0c8bf3816', '0ad529b2-b96e-5751-b2b9-170d0fafc28a'), -- Diazepam Injection 10mg/2ml | Millilitre
    ('f3dbf825-a129-4354-a5d3-905d2eea6c45', 'bf712910-1c7f-4e72-9d50-6eb5453efcfd', 1, '618aad15-ce68-5995-a325-6a7cd8d90b08', '0b3effcf-0944-5e34-a224-2baf21607a8b'), -- Diclofenac Injection 75mg/3ml | Millilitre
    ('8dc8e0e7-ab74-42e2-8f8c-c9bae00333eb', 'bbe6f178-8adf-401c-89e4-ca8e0ccc378a', 1, '8339144b-3adf-5ed1-b993-ec8c6042f7cc', 'c925a30d-9cd6-5f88-960a-e79984edadda'), -- Diclofenac Suppositoire 100mg | Suppositoire
    ('bf999713-eba2-416a-a9f4-c3bc7ba0d6ff', 'bf712910-1c7f-4e72-9d50-6eb5453efcfd', 1, 'c5f673dd-15f1-5e68-aaf2-6848184d684a', 'd631eca4-597d-5d25-9fc0-f81a8998a87f'), -- Dicynone Injection 250mg/2ml | Millilitre
    ('3a771f35-d1d8-440c-b669-acacab0d80b6', 'd81e10fe-0f6a-4b75-b9c0-a5e72d56f3b2', 1, '15ef2bbe-c27d-5b1c-a0b4-fea52429a85e', 'da8ac086-c3bf-57b4-a06d-4b4025022777'), -- Dicytam Injection | Ampoule(s)
    ('80f798eb-e8ce-4161-b2c3-fd3d2ffa2115', '11ae7979-7bb6-49c7-9715-9adacc1b4005', 1, 'a79d0017-fad3-5fb1-a9a0-cf8843e08733', '3c0389e6-1d3b-573f-bb4c-8234bca3b132'), -- Difenasol Gouttes oculaires 0,001% 5ml | Goutte (gtt)
    ('3207cedf-5298-456e-ad68-0537de830e61', 'bf712910-1c7f-4e72-9d50-6eb5453efcfd', 1, '14ebe40b-4b37-5e72-a178-a84fe7095518', 'a40968dd-7721-56f2-8f06-fe0946d6cfa4'), -- Dompéridone Suspension 1mg/ml 125ml | Millilitre
    ('08fcec89-4e5c-4399-bf20-b7712c784a8f', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, '81a6e6e3-515c-516b-b23a-4eea8f3249a3', 'c420ee95-d956-503c-9709-58acefe454f3'), -- Domperidone Comprimé 10mg | Comprimé
    ('bea0e01f-1de7-4624-9844-07233843f054', 'bf712910-1c7f-4e72-9d50-6eb5453efcfd', 1, '31e72bfe-e52e-57d9-8a6d-7d19f11c3ea7', '62ac9d29-36f0-599e-9de9-1d8269e97448'), -- Duphalac Solution 66,5% 200ml | Millilitre
    ('59f70930-c9f5-4754-93c4-7544fdc9a303', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, '0028d271-2167-59a1-8dc7-4cea09081378', '04ed5528-9c06-5609-a39b-51a6b8603f93'), -- Duspatalin Comprimé 200mg | Comprimé
    ('7f5ac2b5-ae07-4c71-a593-0572457b69d6', 'bf712910-1c7f-4e72-9d50-6eb5453efcfd', 1, '5a37ee74-1d84-5e9f-8705-8a4a627fc057', '0a952d89-4807-50ed-88cb-f1f5ec35391b'), -- Eau de Javel Flacon | Millilitre
    ('d02dc08f-e58c-4746-9c33-e68cbb54ad1b', 'd81e10fe-0f6a-4b75-b9c0-a5e72d56f3b2', 1, '052f072e-d4eb-59f7-b2e5-5a1009e50826', '396877cc-b897-5b01-8e90-56b47fadf11d'), -- Éphédrine Injection 30mg | Ampoule(s)
    ('80c46739-b0e6-44c6-ab7d-72d1537a4318', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, 'ced4dbd0-dd66-5a19-be6f-c9d3f1881e1d', 'fde893bf-a097-5086-bbb8-5fc009adb1b5'), -- Erythromycin Comprimé 500mg | Comprimé
    ('9102a80e-418f-4920-ac78-648df8430b9d', '835d9fa5-8807-4965-b7a3-1764a7d04eed', 1, 'c66c3c61-9df8-5a14-9ae8-1fe2c9d2ea94', '6acb2d46-df8d-59a1-a00b-653ed53a5c78'), -- Exonol | Conteneur
    ('b6feb15b-fa78-4081-84a3-41a88f6da77a', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, '466b9f72-e8c8-5cbc-9dbe-f8845110cb07', '6da8d256-3e5a-54c7-abc4-f3690004f1df'), -- Femigeston Comprimé 100mg | Comprimé
    ('467e3a06-d69c-4e99-b4fa-47bde075dcc0', 'd81e10fe-0f6a-4b75-b9c0-a5e72d56f3b2', 1, 'ea550c86-1195-5a49-a7ed-51f5703455aa', '15d6d91d-81e0-5028-8cdc-b16626ebaf91'), -- Fentanyl Injection 0.5mg/10ml | Ampoule(s)
    ('edfc81e1-4be5-4d41-b9da-d83bbc334890', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, 'c37cb45b-0ce5-5907-b95a-4677d8863ae6', '2691a939-8880-515e-a708-770dded2b794'), -- Fercefol Comprimé 100/4/200mg | Comprimé
    ('f809c82a-a777-4ace-bb87-5f8a9964c80a', 'bf712910-1c7f-4e72-9d50-6eb5453efcfd', 1, '556fed48-d5d5-5487-b862-8c85771add2c', '02af58f1-b9cf-5ec6-9be7-1202157cfd69'), -- Fercefol Sirop 50/2/100mg 150ml | Millilitre
    ('a9a94538-927d-4e92-b048-fa91479f9ca2', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, '6ad88e2c-c2b1-51a8-95e0-aa34e91a20e3', 'b33bad00-2eda-5e2d-8071-0b91cd8d720e'), -- Flexdol Comprimé 200/500mg | Comprimé
    ('aa137571-94a8-41f2-95a0-046aa944c577', '04144d11-cfed-4930-8ffc-f1b8be92440b', 1, '351d5314-c54c-5fa8-a1a7-8a22bd218538', '84b9b2e8-5cad-512d-b831-4381014c906e'), -- Floxsol Gouttes Ophtalmiques 0.3% 5ml | Bouteille
    ('45d44ab0-80aa-4651-9ac2-188d430ebc15', '94b2f0e7-0885-430f-8733-e2a93f03095d', 1, '9380b518-ec39-5354-bd6a-ffdffabcbe39', 'a0cf3fef-dffa-567b-9337-ae10e7405781'), -- Flucazol Capsule 100mg | Gellule
    ('1c575b86-aea7-4e10-a8c4-81f06b9239de', '04144d11-cfed-4930-8ffc-f1b8be92440b', 1, 'bfadbdf5-03b0-5483-8e0a-588642f12169', '00f762d5-6ce8-56e5-86a6-55da1f9ca040'), -- Flucazol Suspension 50mg/5ml 60ml | Bouteille
    ('fa4d9028-0c55-4617-8816-34c2162a4a65', '11ae7979-7bb6-49c7-9715-9adacc1b4005', 1, '996f1ded-06c3-50f8-96f7-50d079ad642a', 'c89223ca-5a71-53a2-a4c4-3b2d30c1233d'), -- Fluomet Collyre | Goutte (gtt)
    ('fabb2ba4-2aeb-4d8c-817f-471187b35d59', 'bf712910-1c7f-4e72-9d50-6eb5453efcfd', 1, 'bfa7616f-ff55-53cc-a8c7-2c2df08d241b', 'c41312c3-69d1-5fca-90a9-df44bd72c4fc'), -- Fluothane Flacon | Millilitre
    ('a4112211-6479-4fe1-b68d-5c1b7b7d3850', 'd81e10fe-0f6a-4b75-b9c0-a5e72d56f3b2', 1, 'a347b4d2-a6cb-52f3-ae5b-d20db314fb31', 'b4e87a52-2dff-5f0d-b49d-1b1276b558f7'), -- Gentamicin Injection 80mg/2ml | Ampoule(s)
    ('90c3a1be-2bd0-4e56-93d1-06d99b1caebe', 'd81e10fe-0f6a-4b75-b9c0-a5e72d56f3b2', 1, 'f0252cfa-7d94-54c4-989e-17332561c20b', '480652ca-43a6-5f0c-ab08-e6a510e64d4f'), -- Gluconate de Calcium Injection | Ampoule(s)
    ('7c3c04ae-668f-4526-89a9-a435bbcb71b8', 'bf712910-1c7f-4e72-9d50-6eb5453efcfd', 1, 'a5065b9e-4e01-5ef5-be1e-1a074bf7018d', '1ec435a8-066c-5718-b2a3-3056b434aa71'), -- Grippe Water Flacon | Millilitre
    ('5c6775e6-1a75-47ff-9da4-a9ff718ae3f0', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, '9ab27d9d-bc81-5082-aa50-18f793df8f78', '2d8f421f-3b30-533d-8a77-5c4d30aafcd0'), -- Griséofulvine Comprimé 500mg | Comprimé
    ('044104bd-2b9c-443e-805c-4a96ddaddb65', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, 'f92fa83a-2a83-5335-8d83-bfc54f01b360', 'dc634a23-a9c5-58e1-8c43-693cb0edbcac'), -- Haloperidol Comprimé 5mg | Comprimé
    ('bbd4fdae-d29c-4d08-97a5-2e1c928c479e', 'bf712910-1c7f-4e72-9d50-6eb5453efcfd', 1, 'd7d349a1-a7bb-567b-973b-f2f8594faebe', 'f454dc99-8a50-5da7-b529-6503124350b4'), -- Hydrocortisone Injection 100mg | Millilitre
    ('c1465fc9-88a4-43bd-abc9-04124e1525e6', '94b2f0e7-0885-430f-8733-e2a93f03095d', 1, '92dd1ea0-c543-5562-bdb5-4b8b16c4ae60', '94850a95-e3aa-5b6d-9dfe-0b0c12610b98'), -- Indométacine Gélule 25mg | Gellule
    ('7dfe0e76-dc6b-40ff-86ff-9302d9d64a59', 'bf712910-1c7f-4e72-9d50-6eb5453efcfd', 1, '44fb1907-4cf1-5dfb-9c61-0d5de90377a5', 'd30546d9-f08c-5fbd-bb4c-95f5937b5505'), -- Insuline Rapide Flacon 10ml | Millilitre
    ('c933087b-291a-4011-8681-f93d1e04325f', 'bf712910-1c7f-4e72-9d50-6eb5453efcfd', 1, '4bce91f1-d8a9-596a-a1b8-ee0d5248aed9', 'dd2b5247-474d-5b29-8ff3-7ff2989f5332'), -- Insuline Semi-Lente Flacon 10ml | Millilitre
    ('8269fc83-d6e1-4c20-90f6-41335b6c6234', 'bf712910-1c7f-4e72-9d50-6eb5453efcfd', 1, 'b6b14a42-7de9-5ce2-a496-e4229c820e40', '61492a12-4f70-5081-9691-a4c62dd95650'), -- Kemoxyl+F Suspension 125/125mg/5ml 100ml | Millilitre
    ('c045fba5-5f0f-4fe6-8c5a-3427e867748f', 'd81e10fe-0f6a-4b75-b9c0-a5e72d56f3b2', 1, '540361a9-2e7a-5151-a80a-24c74a6133e1', '45bae98d-77de-587e-b99c-d97bae96c73d'), -- Kétamine Injection 250mg/2ml | Ampoule(s)
    ('0997eb53-4d78-420c-a96f-b8e1980ce119', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, 'a7f514ef-6cd8-5a21-97dc-51530e60d287', 'b226e6f6-4e4b-508c-8588-627de0c2d27e'), -- Kétoconazole Comprimé 200mg | Comprimé
    ('7c53c3c8-3922-494c-ba25-6527036a44d3', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, '2a4bd249-ce96-578d-9515-7d3b5cab616d', 'cf3c821a-537c-569e-8de0-91776efbc971'), -- Knac-75 Comprimé | Comprimé
    ('25f0c5b9-b08b-4ad5-aa30-63c4e80bce7e', '04144d11-cfed-4930-8ffc-f1b8be92440b', 1, 'a1248ef5-304d-5551-b38e-97112b37e97f', '15fe8596-3bc0-5963-97c7-6f1786e4e112'), -- Koflyn Suspension 2.2/110/40/1.1/5ml 100ml | Bouteille
    ('13ce9874-d33f-4643-8dfc-c4235a1d2ca6', '835d9fa5-8807-4965-b7a3-1764a7d04eed', 1, '62534d55-2b6d-54b1-b844-0df0ec8cbde5', 'de45f04a-330b-576f-9781-6e57ce4ddf43'), -- Lamolube Collyre 0,5% 10ml | Conteneur
    ('a265ea14-249b-49de-9f2a-109c132be1e0', '72262ed3-d3e2-4c94-b4d6-567934107481', 1, '538eca2f-80e1-5607-b044-421e1a7c49c9', 'f2c2f9eb-ae0a-5b21-8ffb-a8d09f3e50dd'), -- Lovir Pommade | Application
    ('ef0cd52c-43d0-4b6d-b692-5a16785806a9', 'bf712910-1c7f-4e72-9d50-6eb5453efcfd', 1, '96f3fa75-22c2-52c4-9f2d-c18969aac299', '11ebd62f-c6e5-5931-b1e1-8c32bd23065c'), -- Magsim Sirop 400/20mg 180ml | Millilitre
    ('031eb253-3cfd-4406-aa44-1dd66cc57eb2', 'bf712910-1c7f-4e72-9d50-6eb5453efcfd', 1, '38da46f6-b3f4-5cd7-bc14-ff8e7b12295c', '2851af20-7369-52d0-baf9-bc4ed0025904'), -- Mannitol Solution 20% 100ml | Millilitre
    ('583a431d-98eb-455f-8e3e-9fb898a5d2be', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, 'd9d6c1cf-5cc0-5aac-9529-de75f2d144f6', '25284b47-ccdc-54c9-88e1-09d86f66164a'), -- Mébendazole Comprimé 100mg | Comprimé
    ('6e4eab20-6ce8-4d37-8872-a4ff5280528d', 'bf712910-1c7f-4e72-9d50-6eb5453efcfd', 1, '62ef0f90-687e-5041-9303-c0de941e30d7', 'dbb0bc4e-4188-5ca2-a6b3-6b5b6a18e14f'), -- Mébendazole Suspension Flacon 60ml | Millilitre
    ('217cbdf8-1cf3-4ecb-826a-cd018162d2ed', '11ae7979-7bb6-49c7-9715-9adacc1b4005', 1, '641719d7-53e4-5d53-b4e8-904b2448f213', 'c20cfdb7-6f07-5e4c-9292-09cbacde0a05'), -- Metadex Collyre 0.5% | Goutte (gtt)
    ('1dc2913c-616f-4376-acbd-693a22608331', '72262ed3-d3e2-4c94-b4d6-567934107481', 1, 'd95c6d93-9c27-58f9-871a-4456b31540d2', '1eb20858-f715-5bf4-9b7f-f3687f99bedd'), -- Metadrol Pommade | Application
    ('e9fbedf1-95fb-4b32-bf51-389b35c6c6ee', 'd81e10fe-0f6a-4b75-b9c0-a5e72d56f3b2', 1, 'c6e35220-ad6f-5b73-9160-e7aa69eef681', '63900c39-8b4f-54bc-9153-221ff069fb9f'), -- Métoclopramide (Primpéran) Injection 10mg | Ampoule(s)
    ('07ddeb9c-1029-4ee0-a5ca-08d7db2e409b', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, 'da31747a-cb52-5117-a106-0b935fb0451f', 'e63bbc95-e187-53e1-8ba7-0b9adf3a1fa1'), -- Métoclopramide Comprimé 10mg | Comprimé
    ('d9699d4e-7d21-4be5-88e3-b61453a30b37', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, '62faa0d0-dc4e-513f-b410-b3143642fe6f', 'b27226ac-c607-53aa-a438-a76293bc8e0a'), -- Metronidazole Comprimé 250mg | Comprimé
    ('9737a51c-6b51-43fb-bf8d-5d4960a189e9', 'bf712910-1c7f-4e72-9d50-6eb5453efcfd', 1, '3ca36f1d-02a8-5d6a-91ce-4e51468ec51e', '4b416478-fe91-525d-b470-b553aeeced00'), -- Métronidazole et Norfloxacine Flacon | Millilitre
    ('1b6af6b0-d51a-4fb0-8846-9227ae678e03', '04144d11-cfed-4930-8ffc-f1b8be92440b', 1, '967eea61-1c95-56ad-85ff-85ff32b6bea8', '91d1bc17-2617-5a5c-9238-d7d62ba86ede'), -- Metronidazole Injection 500mg/100ml | Bouteille
    ('a88057d1-2034-4c59-b518-33e827be7c91', '04144d11-cfed-4930-8ffc-f1b8be92440b', 1, '4a931d2f-45d6-56b6-8b10-08de0fb2b8c0', '85187b87-7c3d-5903-b4b1-b6a42efdf7dc'), -- Metronidazole Suspension 125mg/5ml 100ml | Bouteille
    ('78e16e25-57ea-41fb-b775-a2043c448740', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, 'b525fb7c-9e3f-51e9-8dc3-e37145a7c162', '4b90066e-8971-55e7-8614-af2b62c7ddd9'), -- Misoprostol Comprimé 200mcg | Comprimé
    ('86974a5d-5c7f-44ef-b72a-cb78ff943894', 'd81e10fe-0f6a-4b75-b9c0-a5e72d56f3b2', 1, '8a554e06-f5ff-5042-bf60-d204048ecf5c', 'c74fa0c2-f5ba-50b6-81b3-d3d73f406cfd'), -- Morphine Injection | Ampoule(s)
    ('1baf9b05-fcbf-4b3e-b2e7-f8637b6ab6b8', 'bf712910-1c7f-4e72-9d50-6eb5453efcfd', 1, '93e2a4ec-f0b8-526f-b0e7-1444871aaebc', '6d1f00e6-72f8-5109-9f86-abb1d1905d7a'), -- Multivitamine Sirop 100ml | Millilitre
    ('96bd46b0-daaa-49f5-bca3-0a9d44d1c8cd', 'd81e10fe-0f6a-4b75-b9c0-a5e72d56f3b2', 1, '6de9b9ff-e2d9-56ef-a1ff-35a3eedbc3ea', 'e4bca667-c39d-54b5-94e5-a2da568c3334'), -- Naloxone Injection | Ampoule(s)
    ('47046f78-6f95-4a17-a0ff-ca96d0eeb79f', '11ae7979-7bb6-49c7-9715-9adacc1b4005', 1, 'ea4f361a-b41a-5279-acbb-96dd952ffbbf', '044394eb-18e9-50a3-a2fc-7b43625b0c87'), -- Neomdexol Collyre 0.1%/0.35% 5ml | Goutte (gtt)
    ('9fcb495c-647e-4db0-94c0-934ca0774409', 'd81e10fe-0f6a-4b75-b9c0-a5e72d56f3b2', 1, 'c5c4cebd-3d67-52d0-954b-f524cd6d67e3', 'f124d689-8766-5717-9ed0-27e4096ebbb3'), -- Néostigmine Injection 0.5mg/ml | Ampoule(s)
    ('3de37fd0-6ab0-4a25-90ff-73a022cc1f16', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, 'e2181904-9cef-56f3-a45c-19ee3e721805', '45805e8a-e34e-5f6c-896b-f5c4b7383429'), -- Neurontin Comprimé 100mg | Comprimé
    ('6f2d3ab3-220a-4dc4-ae80-90c96bf3be07', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, 'ad201a70-a548-5bae-aeef-d768ab348560', '5c30acaa-7756-5e66-ae63-fd0451cc2cd8'), -- Nifédipine Comprimé 20mg | Comprimé
    ('53bb2d5e-a39d-412f-82b1-043ff945a2b5', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, '3ffe7dc3-7bfd-5cb0-9135-1f3e2ed4e5cd', 'eb50b3a2-023b-5084-82ee-e2b9aded64f1'), -- Nystatin Comprimé Vaginal 100000UI | Comprimé
    ('4079e278-8ae9-4c0e-8870-1899bc791882', '04144d11-cfed-4930-8ffc-f1b8be92440b', 1, '82923d95-42a4-5a9d-8133-12a362fec918', 'b441751e-94ba-5b95-9d3c-104fd6e33906'), -- Nystatin Suspension 100000UI/ml 30ml | Bouteille
    ('f0fffe3a-ab4f-46b5-a15c-017039650428', '72262ed3-d3e2-4c94-b4d6-567934107481', 1, 'a47cd4a6-dc2f-58ba-9894-34c6a61d0949', 'b8072ef3-afa0-56e8-b431-e45b0d5d1621'), -- Occumycine Pommade | Application
    ('6128a466-15d5-402a-93d2-2c5c5431417c', '11ae7979-7bb6-49c7-9715-9adacc1b4005', 1, 'f563d83b-0cfa-513b-814c-966eb1ac20ca', '4273adf3-32c7-5419-a51d-cf00fde02a93'), -- Occurest Collyre | Goutte (gtt)
    ('a7e126cb-6045-4b3a-96cb-e46bc8d6c05c', 'bf712910-1c7f-4e72-9d50-6eb5453efcfd', 1, '287ab082-2155-532c-ac0e-6f2f58e9cbc8', 'af971c1d-f2f2-5004-94fa-5e6dfc7b4c9f'), -- Oméprazole Injection | Millilitre
    ('c6b19c1e-de9e-4a10-a5ad-2918d5e98bf9', 'd81e10fe-0f6a-4b75-b9c0-a5e72d56f3b2', 1, '897a0edb-f9d3-58dd-81bd-9e2f9881726b', '3a13a336-5140-5cd7-bfc5-aeb87a654963'), -- Ondastron Injection | Ampoule(s)
    ('ee434cf0-a5e8-4464-81b9-9ac5ffe3ad60', 'c2beca4d-0e35-4989-8e9d-54134982bb37', 1, 'cb03bb61-9d62-56a7-8913-3721c21009bd', '932f7ced-0905-5644-93fd-05e7370c47e1'), -- Ororinse | Gramme
    ('125a4ea7-817a-4f45-9389-3aabb7c1dff0', '04144d11-cfed-4930-8ffc-f1b8be92440b', 1, '713cb263-704b-5962-911f-bd7910c9ebc6', 'cf882500-36dc-544a-83fb-9f8a153cdca6'), -- Otipax Gouttes Auriculaires | Bouteille
    ('5d66b9b2-7262-4699-a2ca-8492dc43fd66', '11ae7979-7bb6-49c7-9715-9adacc1b4005', 1, 'fffcc989-7af9-5c26-915c-512c7973b21b', '99856290-291e-5145-a52e-69e0690836fe'), -- Otofa Gouttes Auriculaires | Goutte (gtt)
    ('88c35c2c-7e1f-4c4e-a62f-fe7e1388f83c', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, 'b1476acf-a8c0-507b-8ad6-e305d2549066', 'cae6c49c-4b8c-5bda-bc63-493ed4b051fd'), -- Otriken Comprimé 200mg | Comprimé
    ('006b6836-0d5a-4d33-9a00-8358556ec495', 'bf712910-1c7f-4e72-9d50-6eb5453efcfd', 1, 'bbc2e588-735f-53a2-872f-236a1f55f8bb', '20dc487a-6646-5e00-994e-fcffd62421c6'), -- Otriken Suspension 100mg/5ml 60ml | Millilitre
    ('c68496ae-851d-4948-bea8-aa5f8e4601dc', 'bf712910-1c7f-4e72-9d50-6eb5453efcfd', 1, 'b6eb3798-f994-5ede-9760-436bd1272ca0', 'aa8e5ce3-457a-5555-b46e-6ea4c8f78568'), -- Oxytocine Injection 10UI | Millilitre
    ('fd385040-f517-444e-820c-08600d690b52', 'bf712910-1c7f-4e72-9d50-6eb5453efcfd', 1, 'e5f80555-27f4-5fd2-b0dc-9a323ca84278', '0de8510d-bc3f-5a9e-9017-edd031719875'), -- Paidoterin Sirop 1mg/1mg/0.15mg/5mg/1mg/333mg 100ml | Millilitre
    ('a4e5d97a-597a-48fe-baea-797b1a7bf450', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, '4f431b4b-6c0d-5e5b-b653-4a056d8fb65a', 'b41a332f-aec8-5486-8761-e1dfbd58e19e'), -- Pain Out Comprimé 500/50mg | Comprimé
    ('9ae8c5ed-be90-4d26-88cf-f83d57500efa', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, 'c54b6160-5196-53eb-a92d-710649257d79', 'eb7c0dcc-144a-502b-99f6-8d663f3faba0'), -- Palutrine Comprimé 480mg | Comprimé
    ('81358880-6fd7-425a-b7ab-5c94ca6c622d', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, 'd76badc8-2440-593d-b247-61c116c99712', 'af524e4e-48a4-5372-be7c-7bc4807b6d9a'), -- Paracetamol Comprimé 500mg | Comprimé
    ('971c1809-e0ea-433f-97f0-24cb2d8cc947', '835d9fa5-8807-4965-b7a3-1764a7d04eed', 1, 'f2666832-6888-509f-a5be-862ddb89c634', '6d3297c9-9356-544b-9174-4d18d198ff57'), -- Physiodose 0,9% 5ml | Conteneur
    ('43287da1-d665-4286-96d8-30b7bd562c8a', 'bf712910-1c7f-4e72-9d50-6eb5453efcfd', 1, '76ff8079-523d-5ee2-ad13-9d650ceb17ba', 'f74ebb73-be6c-548c-b9b1-14e066744b0e'), -- Podine | Millilitre
    ('d7cf86af-0a33-4396-83e6-11a9e3c71135', '0f63fc83-56a3-48d4-9374-0f1d203ee3e9', 1, 'b342347a-68a0-5b5d-b045-fe5e137d4c85', '22ce1856-3888-5222-ad3f-74998db45389'), -- Polygynax Ovule | Boîte
    ('827ffa2d-c5f4-4d8c-83cb-e7990d7130e6', '72262ed3-d3e2-4c94-b4d6-567934107481', 1, '2e03709b-a69d-5614-8fcd-3d50e9a5c56a', '4bba61c0-551b-5f3c-aa79-9e7497c9fd62'), -- Positon Crème 100/250mg/10MUI 30g | Application
    ('21e10c4d-5220-4e65-962b-d5f62f4aa424', 'bf712910-1c7f-4e72-9d50-6eb5453efcfd', 1, 'd950492c-81c4-51db-8ef6-14596a3a0bab', 'aa8c869e-e8aa-5fc6-9131-3d179579b10b'), -- Solution de Povidone 100ml | Millilitre
    ('0ad50876-a8df-4919-b2fb-b7d68cb0fd99', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, '3fb1b51b-3cd3-5238-873c-77277d1d800a', '3cffc639-49cd-5df1-a96f-764c82664660'), -- Prednisolone Comprimé 5mg | Comprimé
    ('9c1c512a-b0d0-4abe-ba39-24488425059f', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, 'de2eb177-2e07-53dd-a0da-b4cba478b2de', 'fad2fe4b-0c4e-5b12-b090-cce3ca26080b'), -- Prométhazine Comprimé | Comprimé
    ('3133e06b-3e0d-463c-a27c-3f2d14d20ccf', 'd81e10fe-0f6a-4b75-b9c0-a5e72d56f3b2', 1, '1c33e424-3d5b-5319-85c7-0c2c28b9a944', 'c5df134c-e6b4-5a55-a39d-5a24b5fe9c18'), -- Propofol Injection | Ampoule(s)
    ('1bfc3913-5593-4306-9297-541fad08fd79', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, '20fb7e95-f139-51b2-b4fb-77cac2ebb411', '6dc08851-b4cc-5e44-8e2d-2545f9fb89e6'), -- Quinine Comprimé 100mg | Comprimé
    ('f5019c30-bc64-4694-adf9-f4c683092597', 'bf712910-1c7f-4e72-9d50-6eb5453efcfd', 1, '1db804d4-4cdb-5a59-8f0d-046498b10cd8', '3b1cc2b4-26ce-53e7-b836-be1b312b4054'), -- Quinine Injection 500mg | Millilitre
    ('af91a6ca-1c93-4a3b-a44f-3a6bae3de79c', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, '73608a77-e46a-51a8-ad30-bb3445f258aa', 'ddd5c1b8-2266-532f-b5ad-8099c9600669'), -- Quinine Comprimé 300mg | Comprimé
    ('4503c3ad-8a0f-4544-bd48-1bf5a3ed6ef5', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, '956ea845-8e64-562f-a2d2-07d24b16d930', 'cb3ff7e1-d9c3-5ed7-b8f0-755147796922'), -- Quinine Comprimé 500mg | Comprimé
    ('6b8ce408-4909-4edc-87f0-6a856f4f7294', '11ae7979-7bb6-49c7-9715-9adacc1b4005', 1, 'e2d709ce-bfeb-5d94-8d88-82743adfba71', 'fc927197-e327-5641-b991-64e405ab52fe'), -- Rogophen (CAF) Collyre | Goutte (gtt)
    ('41d2a172-fa55-4b00-9dbd-30de646b128b', '2befd840-e135-4fc9-bb9d-acdcce088f19', 1, '81870dd8-a983-5f50-8b9d-b966f243b1e2', '817e11b2-9c58-5903-a173-1879943b7544'), -- Salbutamol Aérosol 100mcg 200 Doses | Aérosol
    ('6a76d20c-8b17-43e1-8f43-66089b7711fd', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, '163b8e31-f782-57a3-a1e6-01e3e168ae76', '21f56792-4c05-5acd-9f45-118a99e42a6e'), -- Salbutamol Comprimé 4mg | Comprimé
    ('75426536-50fb-4f71-81c6-06f2277a406c', 'd81e10fe-0f6a-4b75-b9c0-a5e72d56f3b2', 1, '60629213-35b1-561b-8d89-32cbbe6ac2f5', 'fd6e006c-b864-5243-a512-522a2fc2c848'), -- Salbutamol Solution pour Nébulisation | Ampoule(s)
    ('068861e5-23a6-4a12-86ee-7af6a3ce2ce5', '835d9fa5-8807-4965-b7a3-1764a7d04eed', 1, '761000a7-c43c-51ff-9b17-35f03001dd62', '2d0d3ea5-262f-5e24-b692-71a311bbd718'), -- Salbutamol Sirop 2mg/5ml 100ml | Conteneur
    ('bfad82ea-b72f-4978-8837-06be3e544992', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, '6cfe148b-bba0-5b48-89c6-8e2df209c913', '40fce0ef-2fd1-564e-9a58-bd64b79d0802'), -- Savoeffer Comprimé 500mg | Comprimé
    ('a05dc280-542b-4d28-a5a5-0f206fd5b067', 'bf712910-1c7f-4e72-9d50-6eb5453efcfd', 1, '170e4aa9-9213-530e-af1d-de66d109ca59', '80001c49-00f7-5ff8-a3e6-f887ccd0486c'), -- Sekisan Suspension 3,54ml/ml 120ml | Millilitre
    ('b77b2146-1173-4c1c-b788-e3303a6f0c54', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, 'fd70fed5-38e9-5f4b-8467-84c8dd657292', 'c543ea70-8dd8-5555-a111-19130a84c7a7'), -- Sildénafil Comprimé | Comprimé
    ('db5bf717-f20a-467b-828c-8ed36984c8d5', 'bf712910-1c7f-4e72-9d50-6eb5453efcfd', 1, 'c4d37fb1-6a27-5293-9875-f9165f6378f8', '6259f636-ea9a-521f-a543-66940fd9c81a'), -- Soluté NaCl 0.9% 500ml | Millilitre
    ('b931f08b-94e8-425a-878c-d651b29d7720', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, '5f1d97ee-ba1d-5d66-ad4f-85cfc1c2854d', '330cdbb3-aa27-5929-ade8-da888600590a'), -- Spasnol Comprimé 80mg | Comprimé
    ('f47bef11-887f-4597-b953-727f22768830', 'bf712910-1c7f-4e72-9d50-6eb5453efcfd', 1, 'c2840600-068d-5c43-828a-62e2ff055951', '1c4e0537-8b5a-59af-aa7c-2db68396a354'), -- Spasnol Injection 40mg/0.04mg 4ml | Millilitre
    ('ce121aea-7dbe-4979-ac7d-07f1cb925b9f', 'd81e10fe-0f6a-4b75-b9c0-a5e72d56f3b2', 1, 'b9be8b44-8ee3-569e-8bf7-b831f2fd984c', 'f651bc8c-7485-5872-822d-8b2124b9ea7d'), -- Sulfate de Magnésium Injection | Ampoule(s)
    ('d26b6d03-0a86-4e0f-8e5f-5008cc1e5f6f', 'd4c0ebf9-7a3b-42c0-bbf0-2599efbb2965', 1, 'c4c85542-8017-5239-9f95-ea66cb9ae50b', '11643641-0737-55b4-b48e-a89599c1da29'), -- Tetracycline Onguent 0.01% 5g | Milligramme
    ('b2306702-3f47-4910-885b-9c236dbc64b8', '72262ed3-d3e2-4c94-b4d6-567934107481', 1, '444e9d88-be09-5c01-9235-9269f7b8cacc', '2c4cfdcc-259c-52a5-b93c-b326e3ef4614'), -- Thermocure Crème | Application
    ('55d1010c-485b-41eb-95c4-247259227038', '11ae7979-7bb6-49c7-9715-9adacc1b4005', 1, '12367a52-b1a5-5fe2-aa1f-8d5006832f29', '37633385-ffff-557e-ab59-bc9c8d60de0d'), -- Timosol Collyre | Goutte (gtt)
    ('6299e34e-ccfd-4e01-a3da-bb091de209ad', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, '135b0151-ec76-550f-86e8-defa9c01bdd9', 'c55c1be2-8b29-5f8d-b688-5c9614672235'), -- Tinidazole Comprimé 500mg | Comprimé
    ('69f57aba-a1c3-4405-89b9-6425f94096fd', '11ae7979-7bb6-49c7-9715-9adacc1b4005', 1, '15e46c39-6b32-5f9e-bc40-373afc1c4a8b', 'c7a9f39d-de01-5eee-a20b-7a92e300fc97'), -- Tob Dex Collyre | Goutte (gtt)
    ('cca31c5b-b052-47ac-bb69-19d284b3f587', 'bf712910-1c7f-4e72-9d50-6eb5453efcfd', 1, 'b1863c5f-884a-5213-a49f-33c0cc415931', '71be6596-480e-56d0-8cb9-58926afdc618'), -- Tramadol Injection 100mg/2ml | Millilitre
    ('192d569a-8772-45c0-b6b7-f52d267588bf', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, '21f882d1-e1f8-5975-9959-ae9fa192853b', '56a9920e-94ff-52df-9c32-5c7bf9f17049'), -- Comprimé de Complexe de Vitamines B | Comprimé
    ('59ed05e8-3a56-4ba5-b7cb-d52bd107e388', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', 1, '5b1c604e-1ae4-5da3-ae08-d0c8a67ad234', '8ae4e581-40a9-5de6-b30d-80aadcecf4e3'), -- Sulfate de Zinc Comprimé 20mg | Comprimé
    ('f757c47e-ba33-49c8-b480-86b833d7fe2c', 'c4b6c7b7-4906-4f76-af51-60ec9a34932e', 0, '7ce8d8ea-f21d-5525-a908-a0b83f34766a', '10b4eb03-e127-55ee-a0ee-15bf9b37f812'), -- Abaisse-langue en bois | Unité
    ('deca7191-b059-4ca7-96bf-d1f4fd464566', 'c4b6c7b7-4906-4f76-af51-60ec9a34932e', 0, '788e61ae-9c05-5f14-8068-d8c2d87da2b4', 'ecfca9bb-a11e-5362-a553-487402b95081'), -- Aiguille à ponction lombaire G22 | Unité
    ('385415b2-8acb-4059-9f41-fc80cdb28536', 'c4b6c7b7-4906-4f76-af51-60ec9a34932e', 0, 'f839ffef-804c-5954-8e3d-4d3001b87b5b', 'f2f6acb4-afc8-5a46-98ae-0710e8718039'), -- Aiguille à ponction lombaire G25 | Unité
    ('d5728a3e-1079-4982-81b9-c299f9c962e0', 'c4b6c7b7-4906-4f76-af51-60ec9a34932e', 0, '666e4ee8-2bba-5102-970a-d4c1decad1dd', 'de9bbd7a-26e9-5d9f-bd8b-58b7e22d5a04'), -- Bandage Plâtré 10cmx3cm | Unité
    ('6f6eac84-1f8b-4195-b679-510ade2b11fd', 'c4b6c7b7-4906-4f76-af51-60ec9a34932e', 0, '98c74646-b6f3-5661-9a38-3a3c9bce1c62', 'cdf2511e-6f54-5032-af6e-2c2417dee7e8'), -- Bandage Plâtre 15cmx3cm | Unité
    ('2633fab8-65c3-471c-93ce-c9d22a4141e7', 'c4b6c7b7-4906-4f76-af51-60ec9a34932e', 0, '35003750-1b7b-56db-9ff5-0176ae6b9130', '9967a631-965f-5fc6-88c0-5df1e1661120'), -- Bandage Plâtre 20cmx3cm | Unité
    ('f74820f2-ed9d-461f-8f68-9cf173637121', 'c4b6c7b7-4906-4f76-af51-60ec9a34932e', 0, '6fdc5ef6-09de-5a27-987b-c06c144bb00d', '09987fa9-d87c-559b-b8e9-4495b394dfdc'), -- Bande Ombilicale Somos BB 6cmx2m | Unité
    ('fc31500c-117d-4d85-bad3-b7e2214ecb3b', 'c4b6c7b7-4906-4f76-af51-60ec9a34932e', 0, '8182e77c-2b70-5f0b-ad31-b045deb5187c', 'dde7efa7-aea3-5aed-a8fe-acef0437ca39'), -- Bande Velpeau 15cmx4m | Unité
    ('08da2277-5bc8-497b-8b09-b5cf31f19153', 'c4b6c7b7-4906-4f76-af51-60ec9a34932e', 0, 'ccceae55-0271-54b3-9486-9f7509d4c1d8', '8b0cca55-677e-57a0-ae01-80ee4ee0122d'), -- Bandage Velpeau 10cmx4m | Unité
    ('997b1d6c-8fac-4d10-b190-1fd81da07ef4', 'c4b6c7b7-4906-4f76-af51-60ec9a34932e', 0, '8ee6a628-4ccf-502d-b38d-a3ecaab8c0ec', 'ccfac4dc-2e57-50ec-affe-1364cbb95d38'), -- Bistouri | Unité
    ('ca317da9-d60c-4c99-84be-ce8bf9c9e4a0', 'c4b6c7b7-4906-4f76-af51-60ec9a34932e', 0, 'd2f7e57a-7bd7-5ae5-bb3b-f2973cf4ebe5', '8a45f7f9-131b-5214-af9c-02f1169e753f'), -- Cathéter G18 | Unité
    ('b73dae17-d783-4405-aaf9-386d115b4bee', 'c4b6c7b7-4906-4f76-af51-60ec9a34932e', 0, '7e56a745-19aa-5086-87f4-6f0ad0f961f3', 'c7bc91d0-85ad-5b55-a93c-0bdeb526ecff'), -- Cathéter G22 | Unité
    ('5cbd3265-647a-405d-b604-3f01abac28ae', 'c4b6c7b7-4906-4f76-af51-60ec9a34932e', 0, '5191bc1c-dcd2-5aaf-b3f1-6b2b3d6f784d', '6e44194e-6ff1-50c0-9325-02b71026fe0c'), -- Cathéter G24 | Unité
    ('4aae662c-bed8-4072-aad3-fd4678d44adb', 'c4b6c7b7-4906-4f76-af51-60ec9a34932e', 0, '7baddabc-b459-5edf-b2e0-6631cce6dde1', 'aadb56fe-7115-50f6-b614-423ab80118d4'), -- Compresses stériles 10cm x 10cm | Unité
    ('a76d2394-7da7-4447-801e-debc75a1cd59', 'c4b6c7b7-4906-4f76-af51-60ec9a34932e', 0, '97999d66-e1d4-590c-8fd8-d2d8dc90a4b8', '694333f7-fffb-5b41-981a-620d4f728e19'), -- Coton hydrophile 500g | Unité
    ('c8b1c1f7-ef08-49b4-bef9-e3c90612015d', 'c4b6c7b7-4906-4f76-af51-60ec9a34932e', 0, '735158b8-727e-5719-ae88-fda2398c0e70', 'bd052c97-88d7-543c-be8b-cfc6763e31a2'), -- Pogal N° 1 | Unité
    ('1584d1a8-4f17-4d3b-9709-6c7c4700c2c6', 'c4b6c7b7-4906-4f76-af51-60ec9a34932e', 0, '064cb067-1760-5e65-b5f2-8baf7d938dad', '27704b0d-cf53-5585-bb77-85fb721856c8'), -- Pogal No. 2 | Unité
    ('21b335be-53ea-41b6-a7f6-bf303a94ff95', 'c4b6c7b7-4906-4f76-af51-60ec9a34932e', 0, '4a262830-7873-5412-9ceb-1236a0d11f41', '2b1688de-d2b2-5045-a211-ef4808d499b7'), -- Pogal N° 2/0 | Unité
    ('8dd3ab60-0ffa-402d-923e-febe7e0d04b5', 'c4b6c7b7-4906-4f76-af51-60ec9a34932e', 0, 'c0b798e7-f238-5cb5-9185-3ac3080b678a', '1e9746f1-e9a1-5c26-9bfa-09bfb628215f'), -- Pogal N° 3/0 | Unité
    ('2a843b45-acfc-461a-857e-bd7f010af8ba', 'c4b6c7b7-4906-4f76-af51-60ec9a34932e', 0, '98f3a5e7-0b7f-5d13-8fef-03c61ec6e9a8', '44727a1d-cecb-5fde-b411-f78be9423de1'), -- Suture Non-Absorbable | Unité
    ('b0fe9fc2-905d-43d3-acdb-b8fc9e5640cf', 'c4b6c7b7-4906-4f76-af51-60ec9a34932e', 0, '34511d6b-ce64-5cac-8f71-d116c8bca694', '44f52e7d-a5bc-59a9-b0d3-4e340c22ef68'), -- Gants Stériles | Unité
    ('c296f8db-783d-44d0-9fcf-a7778e9ffc4f', 'c4b6c7b7-4906-4f76-af51-60ec9a34932e', 0, '09a8a405-e566-5f89-b7b3-483cc4e9e896', '93687d10-b9a8-57fb-a35e-e572fd646ce0'), -- Gants Non Stériles | Unité
    ('8c9c4875-7945-4e5b-b540-911428359888', 'c4b6c7b7-4906-4f76-af51-60ec9a34932e', 0, '195a642f-e5bd-5106-9d93-afe4d3d71030', 'bf28a6ce-5c7c-5b86-9a7d-95228b0372a7'), -- Gants gynécologiques | Unité
    ('3830c927-c9c9-4cfe-b07f-f546d2f756c7', 'c4b6c7b7-4906-4f76-af51-60ec9a34932e', 0, 'f3678566-4c86-59e5-b87d-0d5054b1062d', '2cd50adb-4c5d-5ff0-806a-33d565b4db48'), -- Sac à urines | Unité
    ('b52aaf8d-d0ed-41ac-bcc1-e89bd38a40a8', 'c4b6c7b7-4906-4f76-af51-60ec9a34932e', 0, 'af505d86-e929-5f41-b932-a93a3c2dda67', '28c7f26e-d1bc-58ee-a42e-6805f22c6445'), -- Seringue 10ml | Unité
    ('fddb038c-6bb1-4279-9032-e9169d857168', 'c4b6c7b7-4906-4f76-af51-60ec9a34932e', 0, 'b2faa78f-6875-5bd9-bdcc-bf60bde7488c', '0ec4f374-5dfb-505a-b959-b63fc2b126a6'), -- Seringue 2ml | Unité
    ('b31b8536-27e6-448c-b9f8-eec90b932663', 'c4b6c7b7-4906-4f76-af51-60ec9a34932e', 0, '2a5a3b23-07f1-5a93-b100-a58f83c52f31', 'a9163ed0-8265-57d1-ab88-8cfa11ce37c6'), -- Seringue 20ml | Unité
    ('e37eab30-6536-4a17-bfce-923b206f907b', 'c4b6c7b7-4906-4f76-af51-60ec9a34932e', 0, 'ae6c4b19-c903-5447-bbd3-13a7abee3167', '406e5e31-4d1b-5c90-a227-da5fdd0699e8'), -- Seringue 50ml | Unité
    ('baecc8a6-ad4d-4b67-8b3c-a855dd291d72', 'c4b6c7b7-4906-4f76-af51-60ec9a34932e', 0, '3961115d-268a-55a8-a37e-85ff6a05582a', '5cf60848-45a6-54e6-bd12-ebb8d092e3bc'), -- Seringue 5ml | Unité
    ('a1661e95-7897-4038-86cb-954d386fa8f9', '9a169d53-360a-47db-9cfd-26bdbe2bff1b', 0, 'a1094d32-9c62-5bfd-8c47-fe0e00e0ab81', '5483db26-9369-5ddf-b534-66394e43c714'), -- Seringue à insuline 1ml | Seringue
    ('a14a9244-2385-48b3-97cb-00df0cff240b', 'c4b6c7b7-4906-4f76-af51-60ec9a34932e', 0, 'cf5ef15a-4a9b-51b7-b1d0-0f27efd08462', 'e74232a4-8563-584a-9f47-ecbf633bb064'), -- Sonde d’aspiration | Unité
    ('be5b5aec-0147-4d76-9e8f-5252f74188d8', 'c4b6c7b7-4906-4f76-af51-60ec9a34932e', 0, '717f63b2-6750-5805-8085-919326ce275f', '0b31ec98-4ada-5791-a709-dc4c6be9f264'), -- Sonde nasogastrique | Unité
    ('e8d0cca7-f80f-4b70-8777-c158a4f996f4', 'c4b6c7b7-4906-4f76-af51-60ec9a34932e', 0, 'cefb98bd-6b23-5fcb-b7ec-8ea153920ba1', '73af5a1f-3581-543c-86fc-04701ce4545c'), -- Sonde urinaire N° 18 | Unité
    ('5aa469d4-ddc6-4044-9607-bb25518031f1', 'c4b6c7b7-4906-4f76-af51-60ec9a34932e', 0, 'ba27c8c3-a6fe-53ce-8a91-9148f7bf41d4', 'ddca9870-067b-5f0c-b1f9-923f293a48f2'), -- Sonde urinaire N° 14 | Unité
    ('251caad1-14f3-4d5a-9233-ef5077acd5b3', 'c4b6c7b7-4906-4f76-af51-60ec9a34932e', 0, '078a3f7c-2724-5bd0-bb41-202ed2291747', '26094aa8-6bbf-5c79-8e43-cbeaa9da4e91'), -- Sonde urinaire N° 16 | Unité
    ('fc8c6bc1-4dc3-406b-92bb-d0d1f34c18eb', 'c4b6c7b7-4906-4f76-af51-60ec9a34932e', 0, '123ba003-b225-582f-9443-862fa480b74f', 'dfa2f379-74bb-59d6-afb7-8dbf405cad13'), -- Ruban adhésif | Unité
    ('4dd363d1-b503-4ce3-ad9b-d5dc0710236e', 'c4b6c7b7-4906-4f76-af51-60ec9a34932e', 0, '595e5b44-c2e1-550d-a4c9-d81332ef1e5a', 'd819adde-e4aa-551a-b55f-6b6659bd8327'), -- Jeu de perfusion | Unité
    ('1bcc87b5-1ae9-426b-b0a4-ad5929c00b02', 'c4b6c7b7-4906-4f76-af51-60ec9a34932e', 0, 'ed6ce6e9-0033-5a59-8a6c-a54170c72f4c', '9c57b304-9ea6-55c0-a855-d1c3227a95a1'); -- Tulle Gras 10cmx10cm | Unité

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
