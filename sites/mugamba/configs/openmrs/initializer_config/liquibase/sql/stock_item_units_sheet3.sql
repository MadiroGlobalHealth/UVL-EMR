-- #455: the stock and dispensing unit of the #437 stock items, from sheet 3 of the answers the
-- product owner gave on 22 Oct 2026 ("Unité correcte ?").
--
-- Run by the changeset stock_item_units_sheet3-20261023 in ../liquibase.xml, which waits until
-- every item below and every unit exists (Rouleau, Ovule, Paire and Baxter come with the #454 OCL
-- release). Only the items whose unit changes are listed; the other sheet-3 answers confirm the
-- #437 unit. Each item keeps one packaging unit at factor 1, which is the dispensing and the
-- default operations unit, as #437 created it.
--
-- A packaging unit that nothing refers to yet (no transaction, operation, reservation, rule or
-- order line) is changed in place. One already used keeps its history: the item gets a second
-- packaging unit in the new unit and dispenses and counts in it. Idempotent: an item already in
-- its unit is left alone. Rollback: stock_item_units_sheet3_rollback.sql.

CREATE TEMPORARY TABLE uvl_stock_unit_seed (
    stock_item_uuid CHAR(38) NOT NULL,
    packaging_uom_uuid CHAR(38) NOT NULL,
    unit_uuid CHAR(38) NOT NULL,
    previous_unit_uuid CHAR(38) NOT NULL,
    new_packaging_uom_uuid CHAR(38) NOT NULL
);

INSERT INTO uvl_stock_unit_seed (stock_item_uuid, packaging_uom_uuid, unit_uuid, previous_unit_uuid, new_packaging_uom_uuid) VALUES
    ('2171d539-1f37-521d-b83b-628dad97731a', '46901b0a-d14e-5bc3-860e-fce6fa8c73ae', '04144d11-cfed-4930-8ffc-f1b8be92440b', 'bf712910-1c7f-4e72-9d50-6eb5453efcfd', 'eac4791d-9683-5849-896b-f23a8dd2c3be'), -- Ambrosal Sirop | Millilitre -> Flacon
    ('a67b2015-1d6f-5811-aaad-5ea3a92d73bd', '8fb9a0eb-2f09-568d-a0ff-cc6742496ab7', 'd81e10fe-0f6a-4b75-b9c0-a5e72d56f3b2', 'bf712910-1c7f-4e72-9d50-6eb5453efcfd', '5ebb9dc6-d881-5635-857d-abadbb3a8a9e'), -- Aminophylline Injection 250mg/10ml | Millilitre -> Ampoule
    ('8b9102db-9b8b-5f52-afa1-cda6dafb6059', '5c07235b-7aa4-54c9-873d-026148db9a97', '04144d11-cfed-4930-8ffc-f1b8be92440b', 'c2beca4d-0e35-4989-8e9d-54134982bb37', 'b66a6cb8-cf44-52d1-9961-f768ad54446a'), -- Ampicilline Injection 1g | Gramme -> Flacon
    ('8a79d883-4029-52a4-bace-55fad090a61c', '3c668972-40a8-51a9-be2c-d18a0ceaacad', '04144d11-cfed-4930-8ffc-f1b8be92440b', '2befd840-e135-4fc9-bb9d-acdcce088f19', '09198e72-9455-5c8f-8a52-45f3849eae2d'), -- Anginovag Spray 10ml | Aérosol -> Flacon
    ('44d84aee-a03a-543a-9d7e-68bac7e8bcd0', '6bfd2b90-e358-545a-a4c4-7f997777d352', '04144d11-cfed-4930-8ffc-f1b8be92440b', '11ae7979-7bb6-49c7-9715-9adacc1b4005', 'fe29df30-3703-5377-8468-2e10c6fa766d'), -- Aurocrome Collyre | Goutte (gtt) -> Flacon
    ('b6d882d0-e442-5593-9be0-22c8dd6f0525', '8136db07-a31f-5b15-8583-940386b31175', '04144d11-cfed-4930-8ffc-f1b8be92440b', '11ae7979-7bb6-49c7-9715-9adacc1b4005', '12267a23-f2f3-5924-99a4-a8132692df37'), -- Auropred (Prednisolone) Collyre | Goutte (gtt) -> Flacon
    ('b14153a5-cad5-57ec-9363-e887552ca319', '5e04f626-9c3e-503b-a87b-6c8a1b092e03', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', '94b2f0e7-0885-430f-8733-e2a93f03095d', '1d3e8aaa-fa8a-5471-b720-63565e384fbf'), -- Azithromycin Capsule 500mg | Gellule -> Comprimé
    ('ccceae55-0271-54b3-9486-9f7509d4c1d8', '8b0cca55-677e-57a0-ae01-80ee4ee0122d', 'cb3566e8-0ba7-51a7-b468-719953d7bffa', 'c4b6c7b7-4906-4f76-af51-60ec9a34932e', 'bb76885d-9a8a-5a16-9861-90ccb8cfd33d'), -- Bandage Velpeau 10cmx4m | Unité -> Rouleau
    ('6fdc5ef6-09de-5a27-987b-c06c144bb00d', '09987fa9-d87c-559b-b8e9-4495b394dfdc', 'cb3566e8-0ba7-51a7-b468-719953d7bffa', 'c4b6c7b7-4906-4f76-af51-60ec9a34932e', 'c419bd41-7e04-539e-ba5a-7d4002cb6e6c'), -- Bande Ombilicale Somos BB 6cmx2m | Unité -> Rouleau
    ('8182e77c-2b70-5f0b-ad31-b045deb5187c', 'dde7efa7-aea3-5aed-a8fe-acef0437ca39', 'cb3566e8-0ba7-51a7-b468-719953d7bffa', 'c4b6c7b7-4906-4f76-af51-60ec9a34932e', 'b39dc165-ad9b-55f2-a5b3-4ec2cdfd1f63'), -- Bande Velpeau 15cmx4m | Unité -> Rouleau
    ('514a329d-70ee-5941-b274-f5e95ba0a76f', 'e03cca36-83b8-59b0-aeaf-9d8d64ac4a7b', '04144d11-cfed-4930-8ffc-f1b8be92440b', '2befd840-e135-4fc9-bb9d-acdcce088f19', 'fb9dfabf-6ffe-52ec-9abb-c57a543b0baa'), -- Beclo Asma Spray | Aérosol -> Flacon
    ('7e5c06e1-94f6-583b-8be2-ed5162a98e7f', 'fe89f042-2424-525a-839e-9c402286fa22', '04144d11-cfed-4930-8ffc-f1b8be92440b', '835d9fa5-8807-4965-b7a3-1764a7d04eed', 'ce6bdb59-59f2-5db9-a968-fd94e8d3fb6e'), -- Benzyl Benzoate Solution 0.25% 100ml | Conteneur -> Flacon
    ('b32333f3-17dd-5f52-9e6a-360391453a83', 'e2269e0a-0dfc-5b6f-ab6a-b79097d19d74', '04144d11-cfed-4930-8ffc-f1b8be92440b', 'bf712910-1c7f-4e72-9d50-6eb5453efcfd', 'f003ad31-ec19-5a70-8626-416b23f5aa65'), -- Betastène Flacon | Millilitre -> Flacon
    ('822c96a9-1721-532c-9116-fcfb4d4c3d58', '805d4015-d76b-572f-a0df-6bf2d44047d7', '04144d11-cfed-4930-8ffc-f1b8be92440b', '11ae7979-7bb6-49c7-9715-9adacc1b4005', '6d219980-0bd4-59e6-9fbc-704b7ef7a189'), -- Biotyn Collyre | Goutte (gtt) -> Flacon
    ('4ae08fc9-19d4-5f3e-87aa-9e02015d9118', 'b81858ed-f6dd-54f0-80ea-a1f2688a0f64', '04144d11-cfed-4930-8ffc-f1b8be92440b', 'd81e10fe-0f6a-4b75-b9c0-a5e72d56f3b2', '6036f428-28bf-538f-a678-9cfce0ab54ee'), -- Bupivacaïne Hyperbare Injection 20mg/4ml | Ampoule(s) -> Flacon
    ('6198c3c3-9df8-590e-98d1-1275b7d77899', '32e3adf3-d711-558e-9fac-92cf623261cd', '04144d11-cfed-4930-8ffc-f1b8be92440b', 'bf712910-1c7f-4e72-9d50-6eb5453efcfd', 'baab39af-d7d4-52b4-9680-82ad92d6243e'), -- Cefixime Sirop 200mg | Millilitre -> Flacon
    ('933722fc-f384-5c7e-bdc6-35e63fec6b5a', '81f7f93a-bdaa-5271-9cdb-bc2e2c953967', '04144d11-cfed-4930-8ffc-f1b8be92440b', 'bf712910-1c7f-4e72-9d50-6eb5453efcfd', 'e2f83aa9-f8a9-5bf4-a0be-b60b0be4b7e0'), -- Chlorhexidine 1% Flacon 300ml | Millilitre -> Flacon
    ('d45bb867-9850-5717-b4a3-f08da03742a8', 'aa3ac9e8-f91d-5288-a11f-017b385c0771', '04144d11-cfed-4930-8ffc-f1b8be92440b', '11ae7979-7bb6-49c7-9715-9adacc1b4005', '846af1a8-86eb-535b-aeee-0a7f36ffbb25'), -- Ciprofloxacin Collyre 0,3% 5ml | Goutte (gtt) -> Flacon
    ('28042cbc-2adf-5310-8bbf-8a10f9dfcbc5', 'b6392e27-2107-548d-9f04-f808975fb337', '04144d11-cfed-4930-8ffc-f1b8be92440b', 'bf712910-1c7f-4e72-9d50-6eb5453efcfd', '8db22817-77e5-55b0-bc5f-0c3b1a868f3d'), -- Ciprofloxacin Injection 200mg/100ml | Millilitre -> Flacon
    ('a56539d7-554c-5f3b-8031-f0eefcbad003', '8a5c7d1a-be78-5077-b16a-0b2cb8c87273', '04144d11-cfed-4930-8ffc-f1b8be92440b', '11ae7979-7bb6-49c7-9715-9adacc1b4005', '43afd193-915f-5c7a-a28d-91cf220c2f41'), -- Ciptoxen-D Collyre 0.3% | Goutte (gtt) -> Flacon
    ('bb24db96-2601-59ec-b311-a3c5809c57ed', '5bb61123-3e59-56a0-a01f-6187d11f8c29', '04144d11-cfed-4930-8ffc-f1b8be92440b', 'bf712910-1c7f-4e72-9d50-6eb5453efcfd', 'a22f0dda-bc56-5e21-80d2-efa6c3b279b8'), -- Cold Cap Sirop | Millilitre -> Flacon
    ('b62e07b1-7cf4-51ec-9380-648ec06a1029', 'b4066b44-3ae5-50a9-8e1f-7e342e1ce1b0', '04144d11-cfed-4930-8ffc-f1b8be92440b', 'bf712910-1c7f-4e72-9d50-6eb5453efcfd', '46347eef-caef-51e4-b64f-a6a09a96bff3'), -- Contam Suspension 250mg/ml 60ml | Millilitre -> Flacon
    ('97999d66-e1d4-590c-8fd8-d2d8dc90a4b8', '694333f7-fffb-5b41-981a-620d4f728e19', 'cb3566e8-0ba7-51a7-b468-719953d7bffa', 'c4b6c7b7-4906-4f76-af51-60ec9a34932e', '9914f042-1052-5df6-b695-00093519c998'), -- Coton hydrophile 500g | Unité -> Rouleau
    ('b47e6bb6-d090-5146-848c-b8017e3ec684', 'a6b26ce2-134b-5f9a-8514-6be28f314576', '04144d11-cfed-4930-8ffc-f1b8be92440b', '11ae7979-7bb6-49c7-9715-9adacc1b4005', 'b0bdf621-423b-5a58-b5a1-a8a118d4630a'), -- Cromsol Gouttes Oculaires 0.02% 5ml | Goutte (gtt) -> Flacon
    ('4db91674-0fd5-5cef-b0a3-c1fe42cb1c38', '6cc2a3be-5885-5fbd-9678-a2f5fc13d4be', '04144d11-cfed-4930-8ffc-f1b8be92440b', '11ae7979-7bb6-49c7-9715-9adacc1b4005', '188ca36d-ac9d-5100-9734-d4adfb733b45'), -- Cromulline Collyre 0.02% 5ml | Goutte (gtt) -> Flacon
    ('c8e73d63-efee-5de8-a34e-0322e8de5465', '9b9c6443-076d-599f-a29b-5d59c36ae01b', '04144d11-cfed-4930-8ffc-f1b8be92440b', 'bf712910-1c7f-4e72-9d50-6eb5453efcfd', '066cc5bd-bf9d-514e-97b1-77538082cf4c'), -- Dermobacter Flacon 125ml | Millilitre -> Flacon
    ('953db035-2439-51c0-a17e-ee5eabc7897d', '28271ab4-ab08-5685-bfbe-58d3a707d76d', '04144d11-cfed-4930-8ffc-f1b8be92440b', 'bf712910-1c7f-4e72-9d50-6eb5453efcfd', 'edf7509e-60e1-5587-a23c-663a5929ad0b'), -- Deslova Sirop 2.5mg/5ml 60ml | Millilitre -> Flacon
    ('d661baca-d6a3-5208-b33a-124881dca560', '9a44a4b6-c5c2-5c80-9593-33c535edebcd', '04144d11-cfed-4930-8ffc-f1b8be92440b', 'bf712910-1c7f-4e72-9d50-6eb5453efcfd', '407710b8-9b67-5cae-bbf2-eec450e7a02d'), -- Dettol Solution 1L | Millilitre -> Flacon
    ('fc5de89e-2bc6-51f7-a277-a3b0c8bf3816', '0ad529b2-b96e-5751-b2b9-170d0fafc28a', 'd81e10fe-0f6a-4b75-b9c0-a5e72d56f3b2', 'bf712910-1c7f-4e72-9d50-6eb5453efcfd', '91c27bb7-3ba5-5cfa-9801-bfead69f9957'), -- Diazepam Injectable 10mg/2ml | Millilitre -> Ampoule
    ('618aad15-ce68-5995-a325-6a7cd8d90b08', '0b3effcf-0944-5e34-a224-2baf21607a8b', 'd81e10fe-0f6a-4b75-b9c0-a5e72d56f3b2', 'bf712910-1c7f-4e72-9d50-6eb5453efcfd', '26241b77-09c1-5777-9d4e-3f40aac82b36'), -- Diclofenac Injection 75mg/3ml | Millilitre -> Ampoule
    ('c5f673dd-15f1-5e68-aaf2-6848184d684a', 'd631eca4-597d-5d25-9fc0-f81a8998a87f', 'd81e10fe-0f6a-4b75-b9c0-a5e72d56f3b2', 'bf712910-1c7f-4e72-9d50-6eb5453efcfd', '13166f4a-a2c9-5f3d-95c4-b7a17cf6b6f8'), -- Dicynone Injection 250mg/2ml | Millilitre -> Ampoule
    ('a79d0017-fad3-5fb1-a9a0-cf8843e08733', '3c0389e6-1d3b-573f-bb4c-8234bca3b132', '04144d11-cfed-4930-8ffc-f1b8be92440b', '11ae7979-7bb6-49c7-9715-9adacc1b4005', 'cb1d3fd7-ab2b-5e66-958d-65bc5c32f662'), -- Difenasol Gouttes oculaires 0,001% 5ml | Goutte (gtt) -> Flacon
    ('14ebe40b-4b37-5e72-a178-a84fe7095518', 'a40968dd-7721-56f2-8f06-fe0946d6cfa4', '04144d11-cfed-4930-8ffc-f1b8be92440b', 'bf712910-1c7f-4e72-9d50-6eb5453efcfd', '81d49033-ea0f-5d8c-a39e-bd9c0e642b9e'), -- Dompéridone Suspension 1mg/ml 125ml | Millilitre -> Flacon
    ('31e72bfe-e52e-57d9-8a6d-7d19f11c3ea7', '62ac9d29-36f0-599e-9de9-1d8269e97448', '04144d11-cfed-4930-8ffc-f1b8be92440b', 'bf712910-1c7f-4e72-9d50-6eb5453efcfd', '72228ba4-7fc7-5485-81b5-1a364506dbfe'), -- Duphalac Solution 66,5% 200ml | Millilitre -> Flacon
    ('5a37ee74-1d84-5e9f-8705-8a4a627fc057', '0a952d89-4807-50ed-88cb-f1f5ec35391b', '04144d11-cfed-4930-8ffc-f1b8be92440b', 'bf712910-1c7f-4e72-9d50-6eb5453efcfd', '7fd40dcf-0b58-5625-ba37-a0a8efa3faba'), -- Eau de Javel Flacon | Millilitre -> Flacon
    ('556fed48-d5d5-5487-b862-8c85771add2c', '02af58f1-b9cf-5ec6-9be7-1202157cfd69', '04144d11-cfed-4930-8ffc-f1b8be92440b', 'bf712910-1c7f-4e72-9d50-6eb5453efcfd', '2ce26f5a-5f1d-5b62-aa97-42f2dcbebea8'), -- Fercefol Sirop 50/2/100mg 150ml | Millilitre -> Flacon
    ('9380b518-ec39-5354-bd6a-ffdffabcbe39', 'a0cf3fef-dffa-567b-9337-ae10e7405781', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', '94b2f0e7-0885-430f-8733-e2a93f03095d', 'f8ec3ec6-d3b3-5360-bc30-89aae840ca4e'), -- Flucazol Capsule 100mg | Gellule -> Comprimé
    ('996f1ded-06c3-50f8-96f7-50d079ad642a', 'c89223ca-5a71-53a2-a4c4-3b2d30c1233d', '04144d11-cfed-4930-8ffc-f1b8be92440b', '11ae7979-7bb6-49c7-9715-9adacc1b4005', '881c8748-dc2d-5c7e-b458-69ebe860ca33'), -- Fluomet Collyre | Goutte (gtt) -> Flacon
    ('bfa7616f-ff55-53cc-a8c7-2c2df08d241b', 'c41312c3-69d1-5fca-90a9-df44bd72c4fc', '04144d11-cfed-4930-8ffc-f1b8be92440b', 'bf712910-1c7f-4e72-9d50-6eb5453efcfd', '69e0282e-049b-568e-b09a-2db46da765b3'), -- Fluothane Flacon | Millilitre -> Flacon
    ('195a642f-e5bd-5106-9d93-afe4d3d71030', 'bf28a6ce-5c7c-5b86-9a7d-95228b0372a7', '40af7514-27d1-59f7-8acf-e2a1b5f35065', 'c4b6c7b7-4906-4f76-af51-60ec9a34932e', '81086b17-d3d6-5605-9f05-11219b5255be'), -- Gants gynécologiques | Unité -> Paire
    ('34511d6b-ce64-5cac-8f71-d116c8bca694', '44f52e7d-a5bc-59a9-b0d3-4e340c22ef68', '40af7514-27d1-59f7-8acf-e2a1b5f35065', 'c4b6c7b7-4906-4f76-af51-60ec9a34932e', 'b6cc260d-48d2-5bc1-a106-a2874ad50cb2'), -- Gants Stériles | Unité -> Paire
    ('a5065b9e-4e01-5ef5-be1e-1a074bf7018d', '1ec435a8-066c-5718-b2a3-3056b434aa71', '04144d11-cfed-4930-8ffc-f1b8be92440b', 'bf712910-1c7f-4e72-9d50-6eb5453efcfd', '06823e80-d2dc-5820-8711-6698dc9442eb'), -- Grippe Water Flacon | Millilitre -> Flacon
    ('d7d349a1-a7bb-567b-973b-f2f8594faebe', 'f454dc99-8a50-5da7-b529-6503124350b4', '04144d11-cfed-4930-8ffc-f1b8be92440b', 'bf712910-1c7f-4e72-9d50-6eb5453efcfd', 'ea086d22-e6fb-5674-9fe0-c9a070d03cf6'), -- Hydrocortisone Injection 100mg | Millilitre -> Flacon
    ('44fb1907-4cf1-5dfb-9c61-0d5de90377a5', 'd30546d9-f08c-5fbd-bb4c-95f5937b5505', '04144d11-cfed-4930-8ffc-f1b8be92440b', 'bf712910-1c7f-4e72-9d50-6eb5453efcfd', '40d570e8-6b9b-5d0f-bbec-394e120d01e4'), -- Insuline Rapide Flacon 10ml | Millilitre -> Flacon
    ('4bce91f1-d8a9-596a-a1b8-ee0d5248aed9', 'dd2b5247-474d-5b29-8ff3-7ff2989f5332', '04144d11-cfed-4930-8ffc-f1b8be92440b', 'bf712910-1c7f-4e72-9d50-6eb5453efcfd', '78ca8b05-5a74-55eb-ac21-7db09fe7768d'), -- Insuline Semi-Lente Flacon 10ml | Millilitre -> Flacon
    ('540361a9-2e7a-5151-a80a-24c74a6133e1', '45bae98d-77de-587e-b99c-d97bae96c73d', '04144d11-cfed-4930-8ffc-f1b8be92440b', 'd81e10fe-0f6a-4b75-b9c0-a5e72d56f3b2', 'e3f63781-cc66-59ca-ac4e-eb57653b174a'), -- Kétamine Injection 250mg/2ml | Ampoule(s) -> Flacon
    ('538eca2f-80e1-5607-b044-421e1a7c49c9', 'f2c2f9eb-ae0a-5b21-8ffb-a8d09f3e50dd', '2867b8c2-53d1-41cd-a1e9-aad3b1789712', '72262ed3-d3e2-4c94-b4d6-567934107481', '66c49c06-d2c0-5656-a5a7-694a28dadb9b'), -- Lovir Pommade | Application -> Tube
    ('96f3fa75-22c2-52c4-9f2d-c18969aac299', '11ebd62f-c6e5-5931-b1e1-8c32bd23065c', '04144d11-cfed-4930-8ffc-f1b8be92440b', 'bf712910-1c7f-4e72-9d50-6eb5453efcfd', 'dbad08c0-fc5d-5af5-b9e4-9ea0a800a18c'), -- Magsim Sirop 400/20mg 180ml | Millilitre -> Flacon
    ('62ef0f90-687e-5041-9303-c0de941e30d7', 'dbb0bc4e-4188-5ca2-a6b3-6b5b6a18e14f', '04144d11-cfed-4930-8ffc-f1b8be92440b', 'bf712910-1c7f-4e72-9d50-6eb5453efcfd', '3c25a198-6f30-5c39-ba8e-8e690d881310'), -- Mébendazole Suspension Flacon 60ml | Millilitre -> Flacon
    ('641719d7-53e4-5d53-b4e8-904b2448f213', 'c20cfdb7-6f07-5e4c-9292-09cbacde0a05', '04144d11-cfed-4930-8ffc-f1b8be92440b', '11ae7979-7bb6-49c7-9715-9adacc1b4005', '7eda4c3d-90d8-53e0-9651-ea9e4fd559b3'), -- Metadex Collyre 0.5% | Goutte (gtt) -> Flacon
    ('d95c6d93-9c27-58f9-871a-4456b31540d2', '1eb20858-f715-5bf4-9b7f-f3687f99bedd', '2867b8c2-53d1-41cd-a1e9-aad3b1789712', '72262ed3-d3e2-4c94-b4d6-567934107481', '4ed3c443-f6c9-5176-bb9f-896e38eaf612'), -- Metadrol Pommade | Application -> Tube
    ('3ca36f1d-02a8-5d6a-91ce-4e51468ec51e', '4b416478-fe91-525d-b470-b553aeeced00', '04144d11-cfed-4930-8ffc-f1b8be92440b', 'bf712910-1c7f-4e72-9d50-6eb5453efcfd', '2bc05f75-900a-53f2-8b1c-ac3632972da4'), -- Métronidazole et Norfloxacine Flacon | Millilitre -> Flacon
    ('93e2a4ec-f0b8-526f-b0e7-1444871aaebc', '6d1f00e6-72f8-5109-9f86-abb1d1905d7a', '04144d11-cfed-4930-8ffc-f1b8be92440b', 'bf712910-1c7f-4e72-9d50-6eb5453efcfd', '876470c5-3623-5f05-bca7-6a30a02a96ff'), -- Multivitamine Sirop 100ml | Millilitre -> Flacon
    ('ea4f361a-b41a-5279-acbb-96dd952ffbbf', '044394eb-18e9-50a3-a2fc-7b43625b0c87', '04144d11-cfed-4930-8ffc-f1b8be92440b', '11ae7979-7bb6-49c7-9715-9adacc1b4005', '61aa9862-2168-5d05-bd55-49f7ebd57fbf'), -- Neomdexol Collyre 0.1%/0.35% 5ml | Goutte (gtt) -> Flacon
    ('3ffe7dc3-7bfd-5cb0-9135-1f3e2ed4e5cd', 'eb50b3a2-023b-5084-82ee-e2b9aded64f1', 'ad460f3a-0eec-54db-95a1-d358b8fa3a51', '391d2a1b-2aec-4bd7-b43b-e294e7f2b9b9', '33777476-6e92-5ba3-a86f-7383d5c7294f'), -- Nystatin Comprimé Vaginal 100000UI | Comprimé -> Ovule
    ('a47cd4a6-dc2f-58ba-9894-34c6a61d0949', 'b8072ef3-afa0-56e8-b431-e45b0d5d1621', '2867b8c2-53d1-41cd-a1e9-aad3b1789712', '72262ed3-d3e2-4c94-b4d6-567934107481', '0af4ed9a-ea61-503b-8760-293f0832467a'), -- Occumycine Pommade | Application -> Tube
    ('f563d83b-0cfa-513b-814c-966eb1ac20ca', '4273adf3-32c7-5419-a51d-cf00fde02a93', '04144d11-cfed-4930-8ffc-f1b8be92440b', '11ae7979-7bb6-49c7-9715-9adacc1b4005', '6c113558-c044-5e12-bb5d-e6fa7242279d'), -- Occurest Collyre | Goutte (gtt) -> Flacon
    ('287ab082-2155-532c-ac0e-6f2f58e9cbc8', 'af971c1d-f2f2-5004-94fa-5e6dfc7b4c9f', '04144d11-cfed-4930-8ffc-f1b8be92440b', 'bf712910-1c7f-4e72-9d50-6eb5453efcfd', 'b5cb3d07-101a-5508-bbe7-99b8acde7a89'), -- Oméprazole Injection | Millilitre -> Flacon
    ('cb03bb61-9d62-56a7-8913-3721c21009bd', '932f7ced-0905-5644-93fd-05e7370c47e1', '04144d11-cfed-4930-8ffc-f1b8be92440b', 'c2beca4d-0e35-4989-8e9d-54134982bb37', 'c8d9a61d-8ba0-5954-a74a-c496e54b3bef'), -- Ororinse | Gramme -> Flacon
    ('fffcc989-7af9-5c26-915c-512c7973b21b', '99856290-291e-5145-a52e-69e0690836fe', '04144d11-cfed-4930-8ffc-f1b8be92440b', '11ae7979-7bb6-49c7-9715-9adacc1b4005', '9cede441-17dc-5ac0-80f1-6c190c7cfbeb'), -- Otofa Gouttes Auriculaires | Goutte (gtt) -> Flacon
    ('bbc2e588-735f-53a2-872f-236a1f55f8bb', '20dc487a-6646-5e00-994e-fcffd62421c6', '04144d11-cfed-4930-8ffc-f1b8be92440b', 'bf712910-1c7f-4e72-9d50-6eb5453efcfd', 'ef91cfc5-4951-5c9d-a7ea-281fb721ca5c'), -- Otriken Suspension 100mg/5ml 60ml | Millilitre -> Flacon
    ('b6eb3798-f994-5ede-9760-436bd1272ca0', 'aa8e5ce3-457a-5555-b46e-6ea4c8f78568', 'd81e10fe-0f6a-4b75-b9c0-a5e72d56f3b2', 'bf712910-1c7f-4e72-9d50-6eb5453efcfd', '570c2678-6ecf-5e79-81b6-3a079c08e7fe'), -- Oxytocine Injection 10UI | Millilitre -> Ampoule
    ('e5f80555-27f4-5fd2-b0dc-9a323ca84278', '0de8510d-bc3f-5a9e-9017-edd031719875', '04144d11-cfed-4930-8ffc-f1b8be92440b', 'bf712910-1c7f-4e72-9d50-6eb5453efcfd', 'b7460b7b-2470-5a0f-b661-c3834b035c3f'), -- Paidoterin Sirop 1mg/1mg/0.15mg/5mg/1mg/333mg 100ml | Millilitre -> Flacon
    ('76ff8079-523d-5ee2-ad13-9d650ceb17ba', 'f74ebb73-be6c-548c-b9b1-14e066744b0e', '04144d11-cfed-4930-8ffc-f1b8be92440b', 'bf712910-1c7f-4e72-9d50-6eb5453efcfd', '9f13e76a-ed35-50e2-8adf-4a163b87931b'), -- Podine | Millilitre -> Flacon
    ('b342347a-68a0-5b5d-b045-fe5e137d4c85', '22ce1856-3888-5222-ad3f-74998db45389', 'ad460f3a-0eec-54db-95a1-d358b8fa3a51', '0f63fc83-56a3-48d4-9374-0f1d203ee3e9', '0305faeb-dcc3-57a3-bdfc-6d3fe53ebf5e'), -- Polygynax Ovule | Boîte -> Ovule
    ('2e03709b-a69d-5614-8fcd-3d50e9a5c56a', '4bba61c0-551b-5f3c-aa79-9e7497c9fd62', '2867b8c2-53d1-41cd-a1e9-aad3b1789712', '72262ed3-d3e2-4c94-b4d6-567934107481', 'e41be073-8dfe-5279-8e5c-5e110d0b4ad9'), -- Positon Crème 100/250mg/10MUI 30g | Application -> Tube
    ('1db804d4-4cdb-5a59-8f0d-046498b10cd8', '3b1cc2b4-26ce-53e7-b836-be1b312b4054', 'd81e10fe-0f6a-4b75-b9c0-a5e72d56f3b2', 'bf712910-1c7f-4e72-9d50-6eb5453efcfd', '52ed8d05-e70c-5d63-9702-59905b3aa3e8'), -- Quinine Injection 500mg | Millilitre -> Ampoule
    ('e2d709ce-bfeb-5d94-8d88-82743adfba71', 'fc927197-e327-5641-b991-64e405ab52fe', '04144d11-cfed-4930-8ffc-f1b8be92440b', '11ae7979-7bb6-49c7-9715-9adacc1b4005', '1346ee57-0047-523b-b0e7-9743f0c46395'), -- Rogophen (CAF) Collyre | Goutte (gtt) -> Flacon
    ('123ba003-b225-582f-9443-862fa480b74f', 'dfa2f379-74bb-59d6-afb7-8dbf405cad13', 'cb3566e8-0ba7-51a7-b468-719953d7bffa', 'c4b6c7b7-4906-4f76-af51-60ec9a34932e', 'abc835bf-4407-54f8-a642-9a2a0dde6eef'), -- Ruban adhésif | Unité -> Rouleau
    ('761000a7-c43c-51ff-9b17-35f03001dd62', '2d0d3ea5-262f-5e24-b692-71a311bbd718', '04144d11-cfed-4930-8ffc-f1b8be92440b', '835d9fa5-8807-4965-b7a3-1764a7d04eed', 'dc1937a1-0a11-552e-a02e-73a921453096'), -- Salbutamol Sirop 2mg/5ml 100ml | Conteneur -> Flacon
    ('170e4aa9-9213-530e-af1d-de66d109ca59', '80001c49-00f7-5ff8-a3e6-f887ccd0486c', '04144d11-cfed-4930-8ffc-f1b8be92440b', 'bf712910-1c7f-4e72-9d50-6eb5453efcfd', '746d915c-9849-58ec-aad1-171971063b11'), -- Sekisan Suspension 3,54ml/ml 120ml | Millilitre -> Flacon
    ('a1094d32-9c62-5bfd-8c47-fe0e00e0ab81', '5483db26-9369-5ddf-b534-66394e43c714', 'c4b6c7b7-4906-4f76-af51-60ec9a34932e', '9a169d53-360a-47db-9cfd-26bdbe2bff1b', 'df1eff71-b058-5baa-8b94-bd3f4737c7ab'), -- Seringue à insuline 1ml | Seringue -> Pièce
    ('c4d37fb1-6a27-5293-9875-f9165f6378f8', '6259f636-ea9a-521f-a543-66940fd9c81a', '7f4638f9-17fe-5bf4-83c5-8a2eff7d54dc', 'bf712910-1c7f-4e72-9d50-6eb5453efcfd', '0ff309c5-4479-5cde-8734-1261caccd4b3'), -- Soluté NaCl 0.9% 500ml | Millilitre -> Baxter
    ('d950492c-81c4-51db-8ef6-14596a3a0bab', 'aa8c869e-e8aa-5fc6-9131-3d179579b10b', '04144d11-cfed-4930-8ffc-f1b8be92440b', 'bf712910-1c7f-4e72-9d50-6eb5453efcfd', '001acf53-1fd6-5e32-8f74-287ef2664162'), -- Solution de Povidone 100ml | Millilitre -> Flacon
    ('c2840600-068d-5c43-828a-62e2ff055951', '1c4e0537-8b5a-59af-aa7c-2db68396a354', 'd81e10fe-0f6a-4b75-b9c0-a5e72d56f3b2', 'bf712910-1c7f-4e72-9d50-6eb5453efcfd', 'b1a0fc0c-813b-5346-a3fd-14386f69f565'), -- Spasnol Injection 40mg/0.04mg 4ml | Millilitre -> Ampoule
    ('444e9d88-be09-5c01-9235-9269f7b8cacc', '2c4cfdcc-259c-52a5-b93c-b326e3ef4614', '2867b8c2-53d1-41cd-a1e9-aad3b1789712', '72262ed3-d3e2-4c94-b4d6-567934107481', '0e44ae08-2eac-5838-a6ef-a164ba32ac24'), -- Thermocure Crème | Application -> Tube
    ('12367a52-b1a5-5fe2-aa1f-8d5006832f29', '37633385-ffff-557e-ab59-bc9c8d60de0d', '04144d11-cfed-4930-8ffc-f1b8be92440b', '11ae7979-7bb6-49c7-9715-9adacc1b4005', 'ef996625-798f-59af-960e-ff4fb98cb420'), -- Timosol Collyre | Goutte (gtt) -> Flacon
    ('15e46c39-6b32-5f9e-bc40-373afc1c4a8b', 'c7a9f39d-de01-5eee-a20b-7a92e300fc97', '04144d11-cfed-4930-8ffc-f1b8be92440b', '11ae7979-7bb6-49c7-9715-9adacc1b4005', '35edf6a3-4a9f-5f3f-8d98-52fbb713d023'), -- Tob Dex Collyre | Goutte (gtt) -> Flacon
    ('b1863c5f-884a-5213-a49f-33c0cc415931', '71be6596-480e-56d0-8cb9-58926afdc618', 'd81e10fe-0f6a-4b75-b9c0-a5e72d56f3b2', 'bf712910-1c7f-4e72-9d50-6eb5453efcfd', '82a7031d-65fd-5e64-b067-7606bc7b9f7c'); -- Tramadol Injection 100mg/2ml | Millilitre -> Ampoule

UPDATE stockmgmt_stock_item_packaging_uom p
  JOIN uvl_stock_unit_seed s ON s.packaging_uom_uuid = p.uuid
  JOIN concept u ON u.uuid = s.unit_uuid
   SET p.packaging_uom_id = u.concept_id
 WHERE p.packaging_uom_id <> u.concept_id
   AND p.factor = 1
   AND NOT EXISTS (SELECT 1 FROM stockmgmt_stock_item_transaction x WHERE x.stock_item_packaging_uom_id = p.stock_item_packaging_uom_id)
   AND NOT EXISTS (SELECT 1 FROM stockmgmt_reservation_transaction x WHERE x.stock_item_packaging_uom_id = p.stock_item_packaging_uom_id)
   AND NOT EXISTS (SELECT 1 FROM stockmgmt_stock_operation_item x
                    WHERE p.stock_item_packaging_uom_id IN (x.stock_item_packaging_uom_id, x.qty_rcvd_packaging_uom_id, x.qty_req_packaging_uom_id))
   AND NOT EXISTS (SELECT 1 FROM stockmgmt_stock_rule x WHERE x.stock_item_packaging_uom_id = p.stock_item_packaging_uom_id)
   AND NOT EXISTS (SELECT 1 FROM stockmgmt_order_item x WHERE x.stock_item_packaging_uom_id = p.stock_item_packaging_uom_id);

INSERT INTO stockmgmt_stock_item_packaging_uom (stock_item_id, packaging_uom_id, factor, creator, date_created, voided, uuid)
SELECT si.stock_item_id, u.concept_id, 1, 1, NOW(), 0, s.new_packaging_uom_uuid
  FROM uvl_stock_unit_seed s
  JOIN stockmgmt_stock_item si ON si.uuid = s.stock_item_uuid
  JOIN concept u ON u.uuid = s.unit_uuid
 WHERE NOT EXISTS (SELECT 1 FROM stockmgmt_stock_item_packaging_uom p
                    WHERE p.stock_item_id = si.stock_item_id AND p.packaging_uom_id = u.concept_id AND p.voided = 0)
   AND NOT EXISTS (SELECT 1 FROM stockmgmt_stock_item_packaging_uom p WHERE p.uuid = s.new_packaging_uom_uuid);

UPDATE stockmgmt_stock_item si
  JOIN uvl_stock_unit_seed s ON s.stock_item_uuid = si.uuid
  JOIN concept u ON u.uuid = s.unit_uuid
  JOIN stockmgmt_stock_item_packaging_uom p
    ON p.stock_item_id = si.stock_item_id AND p.packaging_uom_id = u.concept_id AND p.voided = 0 AND p.factor = 1
   SET si.dispensing_unit_id = u.concept_id,
       si.dispensing_unit_packaging_uom_id = p.stock_item_packaging_uom_id,
       si.default_stock_operations_uom_id = p.stock_item_packaging_uom_id
 WHERE si.dispensing_unit_id <> u.concept_id
    OR si.dispensing_unit_packaging_uom_id IS NULL
    OR si.dispensing_unit_packaging_uom_id <> p.stock_item_packaging_uom_id;

DROP TEMPORARY TABLE uvl_stock_unit_seed;
