# --- Created by Slick DDL
# To stop Slick DDL generation, remove this comment and start using Evolutions

# --- !Ups

create table "INGREDIENT" ("ID" BIGINT GENERATED BY DEFAULT AS IDENTITY(START WITH 1) NOT NULL PRIMARY KEY,"NAME" VARCHAR NOT NULL);
create unique index "unique_ingredient_name" on "INGREDIENT" ("NAME");
create table "RECIPES" ("ID" BIGINT GENERATED BY DEFAULT AS IDENTITY(START WITH 1) NOT NULL PRIMARY KEY,"NAME" VARCHAR NOT NULL,"DESCRIPTION" VARCHAR NOT NULL,"INSTRUCTIONS" VARCHAR NOT NULL);
create unique index "unique_recipe_name" on "RECIPES" ("NAME");
create table "RECIPE_INGREDIENT" ("ID" BIGINT GENERATED BY DEFAULT AS IDENTITY(START WITH 1) NOT NULL PRIMARY KEY,"UNIT" VARCHAR NOT NULL,"AMOUNT" FLOAT NOT NULL,"RECIPE_ID" BIGINT NOT NULL,"INGREDIENT_ID" BIGINT NOT NULL);
alter table "RECIPE_INGREDIENT" add constraint "INGREDIENT_FK" foreign key("INGREDIENT_ID") references "INGREDIENT"("ID") on update NO ACTION on delete NO ACTION;
alter table "RECIPE_INGREDIENT" add constraint "RECIPE_FK" foreign key("RECIPE_ID") references "RECIPES"("ID") on update NO ACTION on delete NO ACTION;

# --- !Downs

alter table "RECIPE_INGREDIENT" drop constraint "INGREDIENT_FK";
alter table "RECIPE_INGREDIENT" drop constraint "RECIPE_FK";
drop table "INGREDIENT";
drop table "RECIPES";
drop table "RECIPE_INGREDIENT";

