import {Global, Module, OnModuleInit} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Project} from "./models/project.entity";

const entities = [Project];

@Global()
@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  exports: [TypeOrmModule.forFeature(entities)],
  providers: []
})
export class EntityModule implements OnModuleInit {

  async onModuleInit() {
    if (await Project.count() <= 0) {
      const vdd = new Project()
      vdd.name = 'VDD'
      vdd.path = 'C:\\Users\\laure\\IdeaProjects\\vdd_ng'
      await vdd.save()
    }
  }

}
