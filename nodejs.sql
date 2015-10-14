-- phpMyAdmin SQL Dump
-- version 4.4.12
-- http://www.phpmyadmin.net
--
-- Client :  127.0.0.1
-- Généré le :  Mar 29 Septembre 2015 à 22:55
-- Version du serveur :  5.6.25
-- Version de PHP :  5.6.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `node`
--

DELIMITER $$
--
-- Procédures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `insert_calc`(IN `id_s` INT UNSIGNED, IN `nom_b` VARCHAR(255), IN `section_c` INT UNSIGNED, IN `niveau_t` INT UNSIGNED, IN `coeff` FLOAT UNSIGNED, IN `puissance_p` FLOAT UNSIGNED, IN `nb` INT UNSIGNED)
    MODIFIES SQL DATA
BEGIN
    DECLARE resultat int default 0;
    declare i int;
    declare size integer;
    select resultat;
    	/*set resultat=ifnull((SELECT cast(SUBSTRING(PT02,3) as signed)  FROM calcule order by id_calcule desc limit 0,1),0);
        if resultat=null then set resultat=0;
        end if;*/
  set i=0;
 set size=nb;
 while i<size do
insert into calcule(id_source,nom_boucle,PT01,PT02,section_cable,niveau_tension,coefficient,puissance_point) values(id_s,nom_b,concat("PT",i),concat("PT",i+1),section_c,niveau_t,coeff,puissance_p);
 SET  i = i + 1;
 end while;   
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `insert_inv`()
    MODIFIES SQL DATA
BEGIN
declare p1 varchar(50);
declare p varchar(50);
declare p2 varchar(50);
declare p3 varchar(50);
set p3=(SELECT pt01 FROM inverse   LIMIT 0,1);
set p1=(SELECT pt01 FROM inverse ORDER BY id_calcule DESC LIMIT 0,1);
set p=(SELECT pt02 FROM calcule LIMIT 0,1);
set p2=(SELECT pt02 FROM calcule ORDER BY id_calcule DESC LIMIT 0,1 );
select p3;

if p1 is null or p1 <> p or p2 <> p3 then
delete from inverse;
insert into inverse(pt01,pt02,longueur,id_source,nom_boucle,puissance_point,coefficient,niveau_tension,section_cable) select pt02,pt01,longueur,id_source,concat("Boucle ",REPLACE(SUBSTRING(nom_boucle,10,3), '.', ''),concat(".",REPLACE(SUBSTRING(nom_boucle,7,3), '.', ''))),puissance_point,coefficient,niveau_tension,section_cable from calcule  order by id_calcule desc;
else 
update inverse set longueur=(select longueur from calcule as c where c.pt02=inverse.pt01 and c.pt01=inverse.pt02); 

end if;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `inverser_mod`()
    MODIFIES SQL DATA
begin 
call insert_inv();
call update_totalinv();

end$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `modifier`(IN `nb` INT, IN `longu` FLOAT)
    MODIFIES SQL DATA
begin 
call modifier_calcule(nb,longu);
call inverser_mod();

end$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `modifier_calcule`(IN `nb` INT, IN `longu` FLOAT)
    MODIFIES SQL DATA
begin
call update_calcule(nb,longu);
call update_calcule(nb,longu);
call update_calcule(nb,longu);
end$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `update_calcule`(IN `id` INT, IN `longu` FLOAT)
    MODIFIES SQL DATA
BEGIN
    DECLARE resultat varchar(100);
    declare somme float;
    declare soustraction float;
    declare delta float;
    declare boucle varchar(100);
   

    set delta=( select delta_cumulee from calcule where ( id_calcule = IFNULL((select max(id_calcule) from calcule where id_calcule < id) ,0) )); 
    set somme=(select sum(puissance_point) from calcule);
     set soustraction=( select (puissance_cumulee-puissance_point) from calcule where ( id_calcule = IFNULL((select max(id_calcule) from calcule where id_calcule < id),0) ));  
     set resultat=( select PT02 from calcule where ( id_calcule = IFNULL((select max(id_calcule) from calcule where id_calcule < id),0) )); 
     update calcule set intensite=(puissance_cumulee/(22*1.732)) where id_calcule=id;
      update calcule set delta_u=(delta_cumulee/220) where id_calcule=id;
      update calcule set longueur=longu where id_calcule=id;
     update calcule set chute_tension=((coefficient*intensite*longu)/1000) where id_calcule=id; 
  if resultat is null then 
 
 update calcule set puissance_cumulee=somme where id_calcule=id;
 update calcule set delta_cumulee=chute_tension where id_calcule=id;
  else
  
    update calcule set puissance_cumulee=soustraction where id_calcule=id;    
    update calcule set delta_cumulee=(delta+chute_tension) where id_calcule=id;      
  end if;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `update_inverse`(IN `id` INT, IN `longu` FLOAT)
    MODIFIES SQL DATA
BEGIN
    DECLARE resultat varchar(100);
    declare somme float;
    declare soustraction float;
    declare delta float;
    set delta=( select delta_cumulee from inverse where ( id_calcule = IFNULL((select max(id_calcule) from inverse where id_calcule < id),0) )); 
    set somme=(select sum(puissance_point) from inverse);
     set soustraction=( select (puissance_cumulee-puissance_point) from inverse where ( id_calcule = IFNULL((select max(id_calcule) from inverse where id_calcule < id),0) ));    
     set resultat=( select PT02 from inverse where ( id_calcule = IFNULL((select max(id_calcule) from inverse where id_calcule < id),0) )); 
     update inverse set intensite=(puissance_cumulee/(22*1.732)) where id_calcule=id;
      update inverse set delta_u=(delta_cumulee/(220)) where id_calcule=id;
      update inverse set longueur=longu where id_calcule=id;
     update inverse set chute_tension=((coefficient*intensite*longu)/1000) where id_calcule=id; 
  if resultat is  NULL then 
 update inverse set puissance_cumulee=somme where id_calcule=id;
 update inverse set delta_cumulee=chute_tension where id_calcule=id;
  else
    update inverse set puissance_cumulee=soustraction where id_calcule=id;     update inverse set delta_cumulee=(delta+chute_tension) where id_calcule=id;      
  end if;
    
end$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `update_total`()
    NO SQL
BEGIN
declare id_c int;
declare lon float;
DECLARE c1 CURSOR FOR
    	SELECT id_calcule,longueur
    	FROM calcule;
         OPEN c1;
         c1: LOOP
         FETCH c1 INTO id_c,lon;
        call update_calcule(id_c,lon);
         call update_calcule(id_c,lon);
          call update_calcule(id_c,lon);
         end loop;
         CLOSE c1;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `update_totalinv`()
    MODIFIES SQL DATA
BEGIN
declare id_c int;
declare lon float;
DECLARE c1 CURSOR FOR
    	SELECT id_calcule,longueur
    	FROM inverse;
         OPEN c1;
         c1: LOOP
         FETCH c1 INTO id_c,lon;
        call update_inverse(id_c,lon);
         call update_inverse(id_c,lon);
          call update_inverse(id_c,lon);
         end loop;
         CLOSE c1;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Structure de la table `calcule`
--

CREATE TABLE IF NOT EXISTS `calcule` (
  `id_calcule` int(11) NOT NULL,
  `id_source` int(11) NOT NULL,
  `nom_boucle` varchar(50) NOT NULL,
  `PT01` varchar(255) NOT NULL,
  `PT02` varchar(255) NOT NULL,
  `longueur` float NOT NULL,
  `section_cable` int(11) NOT NULL,
  `niveau_tension` int(11) NOT NULL,
  `coefficient` float NOT NULL,
  `puissance_point` float NOT NULL,
  `puissance_cumulee` float NOT NULL,
  `intensite` float NOT NULL,
  `chute_tension` float NOT NULL,
  `delta_cumulee` float NOT NULL,
  `delta_u` float NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=latin1;

--
-- Contenu de la table `calcule`
--

INSERT INTO `calcule` (`id_calcule`, `id_source`, `nom_boucle`, `PT01`, `PT02`, `longueur`, `section_cable`, `niveau_tension`, `coefficient`, `puissance_point`, `puissance_cumulee`, `intensite`, `chute_tension`, `delta_cumulee`, `delta_u`) VALUES
(31, 35, 'boucle 1.8', 'PT0', 'PT1', 120, 240, 22, 0.31, 630, 2520, 66.1348, 2.46021, 2.46021, 0.0111828),
(32, 35, 'boucle 1.8', 'PT1', 'PT2', 124, 240, 22, 0.31, 630, 1890, 49.6011, 1.90667, 4.36688, 0.0198495),
(33, 35, 'boucle 1.8', 'PT2', 'PT3', 140, 240, 22, 0.31, 630, 1260, 33.0674, 1.43512, 5.80201, 0.0263728),
(34, 35, 'boucle 1.8', 'PT3', 'PT4', 123, 240, 22, 0.31, 630, 630, 16.5337, 0.63043, 6.43244, 0.0292383);

-- --------------------------------------------------------

--
-- Structure de la table `inverse`
--

CREATE TABLE IF NOT EXISTS `inverse` (
  `id_calcule` int(11) NOT NULL,
  `id_source` int(11) NOT NULL,
  `nom_boucle` varchar(50) NOT NULL,
  `PT01` varchar(255) NOT NULL,
  `PT02` varchar(255) NOT NULL,
  `longueur` float NOT NULL,
  `section_cable` int(11) NOT NULL,
  `niveau_tension` int(11) NOT NULL,
  `coefficient` float NOT NULL,
  `puissance_point` float NOT NULL,
  `puissance_cumulee` float NOT NULL,
  `intensite` float NOT NULL,
  `chute_tension` float NOT NULL,
  `delta_cumulee` float NOT NULL,
  `delta_u` float NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=282 DEFAULT CHARSET=latin1;

--
-- Contenu de la table `inverse`
--

INSERT INTO `inverse` (`id_calcule`, `id_source`, `nom_boucle`, `PT01`, `PT02`, `longueur`, `section_cable`, `niveau_tension`, `coefficient`, `puissance_point`, `puissance_cumulee`, `intensite`, `chute_tension`, `delta_cumulee`, `delta_u`) VALUES
(275, 35, 'Boucle 8. 1', 'PT4', 'PT3', 123, 240, 22, 0.31, 630, 2520, 66.1348, 2.52172, 2.52172, 0.0114624),
(276, 35, 'Boucle 8. 1', 'PT3', 'PT2', 140, 240, 22, 0.31, 630, 1890, 49.6011, 2.15269, 4.67441, 0.0212473),
(277, 35, 'Boucle 8. 1', 'PT2', 'PT1', 124, 240, 22, 0.31, 630, 1260, 33.0674, 1.27111, 5.94552, 0.0270251),
(278, 35, 'Boucle 8. 1', 'PT1', 'PT0', 120, 240, 22, 0.31, 630, 630, 16.5337, 0.615054, 6.56057, 0.0298208);

-- --------------------------------------------------------

--
-- Structure de la table `source`
--

CREATE TABLE IF NOT EXISTS `source` (
  `id` int(11) NOT NULL,
  `libelle` varchar(50) NOT NULL,
  `adresse` text NOT NULL,
  `puissance` float NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=latin1;

--
-- Contenu de la table `source`
--

INSERT INTO `source` (`id`, `libelle`, `adresse`, `puissance`) VALUES
(35, 'Poste S1', 'Jaouhara', 6352);

-- --------------------------------------------------------

--
-- Structure de la table `t_user`
--

CREATE TABLE IF NOT EXISTS `t_user` (
  `id` int(11) NOT NULL,
  `username` varchar(200) NOT NULL,
  `password_hash` text NOT NULL,
  `password_salt` text NOT NULL,
  `status` enum('0','1') NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

--
-- Contenu de la table `t_user`
--

INSERT INTO `t_user` (`id`, `username`, `password_hash`, `password_salt`, `status`) VALUES
(1, 'admin', 'UIspUPiQIDG0M1hJz6m6tqLcoMo1b6YD7aVxFRuTiSwZwPap02qrSluma8K5dopK60obaSbbbzUahc1eus8FhMsY+YZ+r2DQ4s2UFsQMhcpw7vSYHRWPnuqQw4cJuQWe0O8dbEadE9TLyfWLSkaBWjyK2pY/v07J0rB5zDrtIgw=', 'hPGb2DrvK9pNQQMEPrpuWQ9TKVu8P1fl5Iuz55MlTlqmWx/AxDiOaeIVvqRHzVyk1viXQmhlHwQSYr1EVUl4dcIXkJQsOWqF0rNZiZzXu6AS3gSrfAkJIeUkJEAqwfmkEAumeYnrhknHq0fTb1EpqSqU2tEIKI4M1OLpNM4wXaQ=', '1');

--
-- Index pour les tables exportées
--

--
-- Index pour la table `calcule`
--
ALTER TABLE `calcule`
  ADD PRIMARY KEY (`id_calcule`);

--
-- Index pour la table `inverse`
--
ALTER TABLE `inverse`
  ADD PRIMARY KEY (`id_calcule`);

--
-- Index pour la table `source`
--
ALTER TABLE `source`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `t_user`
--
ALTER TABLE `t_user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables exportées
--

--
-- AUTO_INCREMENT pour la table `calcule`
--
ALTER TABLE `calcule`
  MODIFY `id_calcule` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=35;
--
-- AUTO_INCREMENT pour la table `inverse`
--
ALTER TABLE `inverse`
  MODIFY `id_calcule` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=282;
--
-- AUTO_INCREMENT pour la table `source`
--
ALTER TABLE `source`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=36;
--
-- AUTO_INCREMENT pour la table `t_user`
--
ALTER TABLE `t_user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
DELIMITER $$
--
-- Événements
--
CREATE DEFINER=`root`@`localhost` EVENT `rev` ON SCHEDULE EVERY 1 SECOND STARTS '2015-09-29 00:55:00' ON COMPLETION NOT PRESERVE ENABLE DO BEGIN
CALL inverser_mod();
call update_total(); 
END$$

DELIMITER ;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
