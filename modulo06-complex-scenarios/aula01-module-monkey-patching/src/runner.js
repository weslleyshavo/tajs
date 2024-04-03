import Service from "./service.js";

async function run(item) {
  const service = new Service("heroes");
  const hero = service.createHero(item);
  console.log("createHero", hero);
  const heroes = service.listHeroes();
  console.log("listHeroes", heroes);
}

export { run };
