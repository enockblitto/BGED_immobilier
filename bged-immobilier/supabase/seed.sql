-- ============================================================
-- BGED IMMOBILIER — Données de démonstration
-- ============================================================
-- Ce script insère 24 biens répartis dans plusieurs
-- villes de Côte d'Ivoire, avec des photos, afin que la recherche
-- retourne des résultats dès les premiers tests.
--
-- Les photos proviennent de Picsum Photos (service de placeholders très
-- stable, en service depuis des années). Ce sont des images génériques de
-- démonstration, pas forcément des maisons — le but est uniquement de
-- vérifier que l'affichage des photos fonctionne. En production, chaque
-- société publie ses propres photos via le formulaire "Publier un bien".
--
-- ÉTAPES AVANT D'EXÉCUTER CE SCRIPT :
-- 1. Dans l'application, créez (ou utilisez) un compte "Société
--    immobilière" et complétez son profil.
-- 2. Dans Supabase : Table Editor > profiles, repérez la ligne de
--    cette société et copiez la valeur de la colonne "id" (un UUID,
--    ex: 3fa85f64-5717-4562-b3fc-2c963f66afa6).
-- 3. Dans CE fichier, remplacez TOUTES les occurrences du texte
--    REPLACE_WITH_YOUR_SOCIETE_ID par cet UUID en gardant les
--    apostrophes autour (Rechercher/Remplacer, 24 occurrences).
-- 4. Collez le résultat dans Supabase > SQL Editor > New query, puis
--    cliquez sur "Run". Vérifiez qu'aucune erreur ne s'affiche.
-- 5. Table Editor > properties doit maintenant contenir 24 lignes.
-- ============================================================

-- 1. Villa moderne 4 pièces avec piscine (Abidjan)
with p1 as (
  insert into public.properties (owner_id, title, description, type, price, city, commune, quartier, rooms, surface, status)
  values ('20bb1483-cb67-4504-a709-e0b6e25dd804', 'Villa moderne 4 pièces avec piscine', 'Belle villa avec piscine privée, jardin arboré et garage double, dans un quartier résidentiel calme et sécurisé.', 'Villa', 450000, 'Abidjan', 'Cocody', 'Riviera Golf', 4, 220, 'disponible')
  returning id
)
insert into public.property_images (property_id, image_url)
select id, url from p1, (values
  ('https://picsum.photos/seed/bged-1/900/600'),
  ('https://picsum.photos/seed/bged-2/900/600')
) as imgs(url);

-- 2. Appartement standing vue lagune (Abidjan)
with p2 as (
  insert into public.properties (owner_id, title, description, type, price, city, commune, quartier, rooms, surface, status)
  values ('20bb1483-cb67-4504-a709-e0b6e25dd804', 'Appartement standing vue lagune', 'Appartement lumineux avec vue sur la lagune, climatisation centrale, cuisine équipée et parking sécurisé.', 'Appartement', 280000, 'Abidjan', 'Cocody', 'Ambassades', 3, 110, 'disponible')
  returning id
)
insert into public.property_images (property_id, image_url)
select id, url from p2, (values
  ('https://picsum.photos/seed/bged-3/900/600'),
  ('https://picsum.photos/seed/bged-4/900/600')
) as imgs(url);

-- 3. Studio meublé proche université (Abidjan)
with p3 as (
  insert into public.properties (owner_id, title, description, type, price, city, commune, quartier, rooms, surface, status)
  values ('20bb1483-cb67-4504-a709-e0b6e25dd804', 'Studio meublé proche université', 'Studio entièrement meublé, idéal pour étudiant ou jeune actif, à deux pas de l''université Félix Houphouët-Boigny.', 'Studio', 95000, 'Abidjan', 'Cocody', 'Danga', 1, 28, 'disponible')
  returning id
)
insert into public.property_images (property_id, image_url)
select id, url from p3, (values
  ('https://picsum.photos/seed/bged-5/900/600'),
  ('https://picsum.photos/seed/bged-6/900/600')
) as imgs(url);

-- 4. Maison 3 chambres avec cour (Abidjan)
with p4 as (
  insert into public.properties (owner_id, title, description, type, price, city, commune, quartier, rooms, surface, status)
  values ('20bb1483-cb67-4504-a709-e0b6e25dd804', 'Maison 3 chambres avec cour', 'Maison familiale avec grande cour, idéale pour une famille, proche des commerces et transports.', 'Maison', 150000, 'Abidjan', 'Yopougon', 'Niangon', 3, 130, 'disponible')
  returning id
)
insert into public.property_images (property_id, image_url)
select id, url from p4, (values
  ('https://picsum.photos/seed/bged-7/900/600'),
  ('https://picsum.photos/seed/bged-8/900/600')
) as imgs(url);

-- 5. Appartement 2 pièces rénové (Abidjan)
with p5 as (
  insert into public.properties (owner_id, title, description, type, price, city, commune, quartier, rooms, surface, status)
  values ('20bb1483-cb67-4504-a709-e0b6e25dd804', 'Appartement 2 pièces rénové', 'Appartement récemment rénové, cuisine américaine, salle de bain moderne, immeuble avec ascenseur.', 'Appartement', 175000, 'Abidjan', 'Marcory', 'Zone 4', 2, 65, 'disponible')
  returning id
)
insert into public.property_images (property_id, image_url)
select id, url from p5, (values
  ('https://picsum.photos/seed/bged-9/900/600'),
  ('https://picsum.photos/seed/bged-10/900/600')
) as imgs(url);

-- 6. Duplex haut standing (Abidjan)
with p6 as (
  insert into public.properties (owner_id, title, description, type, price, city, commune, quartier, rooms, surface, status)
  values ('20bb1483-cb67-4504-a709-e0b6e25dd804', 'Duplex haut standing', 'Duplex de standing au cœur du Plateau, terrasse panoramique, parking privé, sécurité 24h/24.', 'Appartement', 520000, 'Abidjan', 'Plateau', 'Centre affaires', 4, 180, 'disponible')
  returning id
)
insert into public.property_images (property_id, image_url)
select id, url from p6, (values
  ('https://picsum.photos/seed/bged-11/900/600'),
  ('https://picsum.photos/seed/bged-12/900/600')
) as imgs(url);

-- 7. Villa 5 pièces avec dépendance (Abidjan)
with p7 as (
  insert into public.properties (owner_id, title, description, type, price, city, commune, quartier, rooms, surface, status)
  values ('20bb1483-cb67-4504-a709-e0b6e25dd804', 'Villa 5 pièces avec dépendance', 'Grande villa avec dépendance indépendante, jardin paysager et véranda, quartier calme et arboré.', 'Villa', 600000, 'Abidjan', 'Riviera', 'Riviera 3', 5, 260, 'disponible')
  returning id
)
insert into public.property_images (property_id, image_url)
select id, url from p7, (values
  ('https://picsum.photos/seed/bged-13/900/600'),
  ('https://picsum.photos/seed/bged-14/900/600')
) as imgs(url);

-- 8. Studio économique centre-ville (Abidjan)
with p8 as (
  insert into public.properties (owner_id, title, description, type, price, city, commune, quartier, rooms, surface, status)
  values ('20bb1483-cb67-4504-a709-e0b6e25dd804', 'Studio économique centre-ville', 'Studio simple et fonctionnel, proche des gares routières et du grand marché.', 'Studio', 65000, 'Abidjan', 'Adjamé', '220 Logements', 1, 22, 'disponible')
  returning id
)
insert into public.property_images (property_id, image_url)
select id, url from p8, (values
  ('https://picsum.photos/seed/bged-15/900/600'),
  ('https://picsum.photos/seed/bged-16/900/600')
) as imgs(url);

-- 9. Appartement 3 pièces Angré (Abidjan)
with p9 as (
  insert into public.properties (owner_id, title, description, type, price, city, commune, quartier, rooms, surface, status)
  values ('20bb1483-cb67-4504-a709-e0b6e25dd804', 'Appartement 3 pièces Angré', 'Appartement au calme dans une résidence sécurisée avec espace vert commun et parking.', 'Appartement', 230000, 'Abidjan', 'Cocody', 'Angré 8e Tranche', 3, 95, 'disponible')
  returning id
)
insert into public.property_images (property_id, image_url)
select id, url from p9, (values
  ('https://picsum.photos/seed/bged-17/900/600'),
  ('https://picsum.photos/seed/bged-18/900/600')
) as imgs(url);

-- 10. Maison contemporaine avec jardin (Abidjan)
with p10 as (
  insert into public.properties (owner_id, title, description, type, price, city, commune, quartier, rooms, surface, status)
  values ('20bb1483-cb67-4504-a709-e0b6e25dd804', 'Maison contemporaine avec jardin', 'Maison neuve de style contemporain, jardin privatif, quartier en plein essor proche d''Abidjan.', 'Maison', 190000, 'Abidjan', 'Bingerville', 'Centre-ville', 3, 140, 'disponible')
  returning id
)
insert into public.property_images (property_id, image_url)
select id, url from p10, (values
  ('https://picsum.photos/seed/bged-19/900/600'),
  ('https://picsum.photos/seed/bged-20/900/600')
) as imgs(url);

-- 11. Appartement meublé Zone 4C (Abidjan)
with p11 as (
  insert into public.properties (owner_id, title, description, type, price, city, commune, quartier, rooms, surface, status)
  values ('20bb1483-cb67-4504-a709-e0b6e25dd804', 'Appartement meublé Zone 4C', 'Appartement entièrement meublé et équipé, à proximité des restaurants et bureaux de Zone 4.', 'Appartement', 320000, 'Abidjan', 'Marcory', 'Zone 4C', 2, 80, 'disponible')
  returning id
)
insert into public.property_images (property_id, image_url)
select id, url from p11, (values
  ('https://picsum.photos/seed/bged-21/900/600'),
  ('https://picsum.photos/seed/bged-22/900/600')
) as imgs(url);

-- 12. Villa pieds dans l'eau (Grand-Bassam)
with p12 as (
  insert into public.properties (owner_id, title, description, type, price, city, commune, quartier, rooms, surface, status)
  values ('20bb1483-cb67-4504-a709-e0b6e25dd804', 'Villa pieds dans l''eau', 'Villa exceptionnelle en bord de mer avec accès direct à la plage, idéale pour week-ends et location longue durée.', 'Villa', 380000, 'Grand-Bassam', 'Vitré 2', 'Bord de mer', 4, 200, 'disponible')
  returning id
)
insert into public.property_images (property_id, image_url)
select id, url from p12, (values
  ('https://picsum.photos/seed/bged-23/900/600'),
  ('https://picsum.photos/seed/bged-24/900/600')
) as imgs(url);

-- 13. Maison familiale centre-ville (Bouaké)
with p13 as (
  insert into public.properties (owner_id, title, description, type, price, city, commune, quartier, rooms, surface, status)
  values ('20bb1483-cb67-4504-a709-e0b6e25dd804', 'Maison familiale centre-ville', 'Grande maison familiale proche du centre commercial de Bouaké, cour spacieuse et sécurisée.', 'Maison', 110000, 'Bouaké', 'Centre-ville', 'Commerce', 4, 150, 'disponible')
  returning id
)
insert into public.property_images (property_id, image_url)
select id, url from p13, (values
  ('https://picsum.photos/seed/bged-25/900/600'),
  ('https://picsum.photos/seed/bged-26/900/600')
) as imgs(url);

-- 14. Appartement moderne Bouaké (Bouaké)
with p14 as (
  insert into public.properties (owner_id, title, description, type, price, city, commune, quartier, rooms, surface, status)
  values ('20bb1483-cb67-4504-a709-e0b6e25dd804', 'Appartement moderne Bouaké', 'Appartement moderne dans une résidence calme, proche des écoles et commerces de proximité.', 'Appartement', 90000, 'Bouaké', 'N''Gattakro', null, 2, 70, 'disponible')
  returning id
)
insert into public.property_images (property_id, image_url)
select id, url from p14, (values
  ('https://picsum.photos/seed/bged-27/900/600'),
  ('https://picsum.photos/seed/bged-28/900/600')
) as imgs(url);

-- 15. Villa avec vue sur la basilique (Yamoussoukro)
with p15 as (
  insert into public.properties (owner_id, title, description, type, price, city, commune, quartier, rooms, surface, status)
  values ('20bb1483-cb67-4504-a709-e0b6e25dd804', 'Villa avec vue sur la basilique', 'Belle villa avec vue dégagée, proche de la basilique Notre-Dame de la Paix, quartier résidentiel calme.', 'Villa', 260000, 'Yamoussoukro', 'Habitat', null, 4, 210, 'disponible')
  returning id
)
insert into public.property_images (property_id, image_url)
select id, url from p15, (values
  ('https://picsum.photos/seed/bged-29/900/600'),
  ('https://picsum.photos/seed/bged-30/900/600')
) as imgs(url);

-- 16. Studio proche gare routière (Yamoussoukro)
with p16 as (
  insert into public.properties (owner_id, title, description, type, price, city, commune, quartier, rooms, surface, status)
  values ('20bb1483-cb67-4504-a709-e0b6e25dd804', 'Studio proche gare routière', 'Studio pratique et abordable, proche de la gare routière et des principaux axes de la ville.', 'Studio', 55000, 'Yamoussoukro', 'Kokrenou', null, 1, 25, 'disponible')
  returning id
)
insert into public.property_images (property_id, image_url)
select id, url from p16, (values
  ('https://picsum.photos/seed/bged-31/900/600'),
  ('https://picsum.photos/seed/bged-32/900/600')
) as imgs(url);

-- 17. Maison 3 pièces San-Pédro (San-Pédro)
with p17 as (
  insert into public.properties (owner_id, title, description, type, price, city, commune, quartier, rooms, surface, status)
  values ('20bb1483-cb67-4504-a709-e0b6e25dd804', 'Maison 3 pièces San-Pédro', 'Maison confortable proche du port, quartier animé avec commerces et écoles à proximité.', 'Maison', 120000, 'San-Pédro', 'Bardo', null, 3, 120, 'disponible')
  returning id
)
insert into public.property_images (property_id, image_url)
select id, url from p17, (values
  ('https://picsum.photos/seed/bged-33/900/600'),
  ('https://picsum.photos/seed/bged-34/900/600')
) as imgs(url);

-- 18. Appartement vue port (San-Pédro)
with p18 as (
  insert into public.properties (owner_id, title, description, type, price, city, commune, quartier, rooms, surface, status)
  values ('20bb1483-cb67-4504-a709-e0b6e25dd804', 'Appartement vue port', 'Appartement avec vue partielle sur le port, immeuble récent avec parking sécurisé.', 'Appartement', 145000, 'San-Pédro', 'Balmer', null, 2, 75, 'disponible')
  returning id
)
insert into public.property_images (property_id, image_url)
select id, url from p18, (values
  ('https://picsum.photos/seed/bged-35/900/600'),
  ('https://picsum.photos/seed/bged-36/900/600')
) as imgs(url);

-- 19. Villa moderne Korhogo (Korhogo)
with p19 as (
  insert into public.properties (owner_id, title, description, type, price, city, commune, quartier, rooms, surface, status)
  values ('20bb1483-cb67-4504-a709-e0b6e25dd804', 'Villa moderne Korhogo', 'Villa moderne dans un quartier résidentiel calme, grand jardin et garage pour deux véhicules.', 'Villa', 175000, 'Korhogo', 'Résidentiel', null, 4, 190, 'disponible')
  returning id
)
insert into public.property_images (property_id, image_url)
select id, url from p19, (values
  ('https://picsum.photos/seed/bged-37/900/600'),
  ('https://picsum.photos/seed/bged-38/900/600')
) as imgs(url);

-- 20. Maison traditionnelle rénovée (Korhogo)
with p20 as (
  insert into public.properties (owner_id, title, description, type, price, city, commune, quartier, rooms, surface, status)
  values ('20bb1483-cb67-4504-a709-e0b6e25dd804', 'Maison traditionnelle rénovée', 'Maison rénovée alliant charme traditionnel et confort moderne, proche du grand marché.', 'Maison', 85000, 'Korhogo', 'Centre-ville', null, 3, 110, 'disponible')
  returning id
)
insert into public.property_images (property_id, image_url)
select id, url from p20, (values
  ('https://picsum.photos/seed/bged-39/900/600'),
  ('https://picsum.photos/seed/bged-40/900/600')
) as imgs(url);

-- 21. Appartement 2 pièces Daloa (Daloa)
with p21 as (
  insert into public.properties (owner_id, title, description, type, price, city, commune, quartier, rooms, surface, status)
  values ('20bb1483-cb67-4504-a709-e0b6e25dd804', 'Appartement 2 pièces Daloa', 'Appartement clair et bien agencé, proche des administrations et du centre-ville de Daloa.', 'Appartement', 100000, 'Daloa', 'Tazibouo', null, 2, 68, 'disponible')
  returning id
)
insert into public.property_images (property_id, image_url)
select id, url from p21, (values
  ('https://picsum.photos/seed/bged-41/900/600'),
  ('https://picsum.photos/seed/bged-42/900/600')
) as imgs(url);

-- 22. Villa avec grand jardin (Man)
with p22 as (
  insert into public.properties (owner_id, title, description, type, price, city, commune, quartier, rooms, surface, status)
  values ('20bb1483-cb67-4504-a709-e0b6e25dd804', 'Villa avec grand jardin', 'Villa spacieuse entourée d''un grand jardin, cadre verdoyant typique des montagnes de Man.', 'Villa', 160000, 'Man', 'Libreville', null, 4, 200, 'disponible')
  returning id
)
insert into public.property_images (property_id, image_url)
select id, url from p22, (values
  ('https://picsum.photos/seed/bged-43/900/600'),
  ('https://picsum.photos/seed/bged-44/900/600')
) as imgs(url);

-- 23. Studio confort centre Gagnoa (Gagnoa)
with p23 as (
  insert into public.properties (owner_id, title, description, type, price, city, commune, quartier, rooms, surface, status)
  values ('20bb1483-cb67-4504-a709-e0b6e25dd804', 'Studio confort centre Gagnoa', 'Studio confortable et bien situé, proche du marché central et des transports en commun.', 'Studio', 60000, 'Gagnoa', 'Centre-ville', null, 1, 26, 'disponible')
  returning id
)
insert into public.property_images (property_id, image_url)
select id, url from p23, (values
  ('https://picsum.photos/seed/bged-45/900/600'),
  ('https://picsum.photos/seed/bged-46/900/600')
) as imgs(url);

-- 24. Appartement familial 3 pièces (Abidjan)
with p24 as (
  insert into public.properties (owner_id, title, description, type, price, city, commune, quartier, rooms, surface, status)
  values ('20bb1483-cb67-4504-a709-e0b6e25dd804', 'Appartement familial 3 pièces', 'Appartement familial dans résidence calme, proche des écoles primaires et secondaires.', 'Appartement', 135000, 'Abidjan', 'Yopougon', 'Sicogi', 3, 90, 'disponible')
  returning id
)
insert into public.property_images (property_id, image_url)
select id, url from p24, (values
  ('https://picsum.photos/seed/bged-47/900/600'),
  ('https://picsum.photos/seed/bged-48/900/600')
) as imgs(url);

