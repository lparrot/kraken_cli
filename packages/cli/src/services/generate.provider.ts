import {Inject, Injectable} from "@nestjs/common";
import {ProjectProvider} from "./project.provider";
import {TemplateProvider} from "./template.provider";

@Injectable()
export class GenerateProvider {

  @Inject(ProjectProvider) projectProvider: ProjectProvider;
  @Inject(TemplateProvider) templateProvider: TemplateProvider;

  async generatePage(options: { cwd?: string, data: { name: string, title: string } }, paths?: any) {
    const {cwd, data} = options

    if (paths == null) {
      paths = this.projectProvider.getProjectPaths(cwd)
    }

    await this.templateProvider.generate({
        cwd,
        data,
        templatePath: 'page',
        targetPath: paths.web_pages_path,
      }
    )
  }

}
