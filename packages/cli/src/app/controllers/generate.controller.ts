import {Body, Controller, Inject, Post} from '@nestjs/common'
import {PostGenerateControllerBody, PostGenerateEntityBody, PostGeneratePageBody, PostGenerateReferentielBody, PostGenerateTimerBody, TemplateInitOptions} from '@kraken/types'
import {GenerateProvider} from 'src/services/generate.provider'
import * as path from 'path'
import {Project} from 'src/app/entities/models/project.entity'

const shelljs = require('shelljs')

@Controller('generate')
export class GenerateController {

  @Inject(GenerateProvider) generateProvider: GenerateProvider

  @Post('init')
  async generateInit(@Body() body: TemplateInitOptions) {
    await this.generateProvider.initProject('complete', body)

    const is_idea_installed = shelljs.which('idea') != null
    const project_path = path.join(body.cwd, body.artifact_id)

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
    await this.generateProvider.generateController(body)
  }

  @Post('referentiel')
  async generateReferentiel(@Body() body: PostGenerateReferentielBody) {
    await this.generateProvider.generateReferentiel(body)
  }

  @Post('page')
  async generatePage(@Body() body: PostGeneratePageBody) {
    const { cwd, ...data } = body
    await this.generateProvider.generatePage(body)
  }

  @Post('entity')
  async generateEntity(@Body() body: PostGenerateEntityBody) {
    await this.generateProvider.generateEntity(body)
  }

  @Post('timer')
  async generateTimer(@Body() body: PostGenerateTimerBody) {
    await this.generateProvider.generateTimer(body)
  }

}
