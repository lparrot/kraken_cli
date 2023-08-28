import {Body, Controller, Inject, Post} from '@nestjs/common'
import {PostGenerateControllerBody, PostGenerateEntityBody, PostGeneratePageBody, PostGenerateReferentielBody, TemplateInitOptions} from '@kraken/types'
import {GenerateProvider} from 'src/services/generate.provider'
import * as path from 'path'
import {snakecase} from 'stringcase'
import {Project} from 'src/app/entities/models/project.entity'

const shelljs = require('shelljs')

@Controller('generate')
export class GenerateController {

  @Inject(GenerateProvider) generateProvider: GenerateProvider

  @Post('init')
  async generateInit(@Body() body: TemplateInitOptions) {
    await this.generateProvider.initProject('complete', body)

    const is_idea_installed = shelljs.which('idea') != null
    const project_path = path.join(body.cwd, snakecase(body.name))

    if (is_idea_installed) {
      shelljs.exec(`idea ${project_path}`, { async: true })
    } else {
      shelljs.exec(`start ${project_path}`, { async: true })
    }

    if (body.with_create) {
      const project = Project.create({
        name: body.name,
        path: project_path
      })
      await project.save()

      return project
    }

    return body
  }

  @Post('controller')
  async generateController(@Body() body: PostGenerateControllerBody) {
    const { cwd, ...data } = body
    await this.generateProvider.generateController({ cwd, data })
  }

  @Post('referentiel')
  async generateReferentiel(@Body() body: PostGenerateReferentielBody) {
    const { cwd, ...data } = body
    await this.generateProvider.generateReferentiel({ cwd, data })
  }

  @Post('page')
  async generatePage(@Body() body: PostGeneratePageBody) {
    const { cwd, ...data } = body
    await this.generateProvider.generatePage({ cwd, data })
  }

  @Post('entity')
  async generateEntity(@Body() body: PostGenerateEntityBody) {
    await this.generateProvider.generateEntity(body)
  }

}
