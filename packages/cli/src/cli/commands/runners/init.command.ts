import {Command, CommandRunner} from "nest-commander";
import {Inject} from "@nestjs/common";
import {TemplateProvider} from "../../../services/template.provider";
import {ProjectProvider} from "../../../services/project.provider";

@Command({
  name: 'init',
  description: 'Initialise un nouveau projet Kraken'
})
export class InitCommand extends CommandRunner {
  @Inject(ProjectProvider) projectProvider: ProjectProvider;
  @Inject(TemplateProvider) templateProvider: TemplateProvider;

  async run(inputs: string[], options: Record<string, string>): Promise<void> {
    console.log(this.projectProvider.getProjectPaths(process.cwd()))
  }
}
