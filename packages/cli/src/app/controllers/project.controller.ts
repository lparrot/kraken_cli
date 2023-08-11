import { Body, Controller, Delete, Get, HttpException, HttpStatus, Inject, Param, Post, Query, Res } from '@nestjs/common'
import { Response } from 'express'
import { Project } from 'src/app/entities/models/project.entity'
import { ShellCommandsProvider } from 'src/services/shell-commands.provider'
import { ProjectProvider } from 'src/services/project.provider'
import { AppProvider } from 'src/app/app.provider'
import { ProjectAttributes } from '@kraken/types'
import * as path from 'path'
import { globSync } from 'glob'
import * as fs from 'fs'

@Controller('projects')
export class ProjectController {

  @Inject(ProjectProvider) projectProvider: ProjectProvider
  @Inject(ShellCommandsProvider) shellCommandsProvider: ShellCommandsProvider
  @Inject(AppProvider) appProvider: AppProvider

  @Get(':id/ping')
  async getProjectPing(@Param('id') id: number, @Res() res: Response) {
    const project = await Project.findOneBy({ id })

    if (project == null) {
      throw new HttpException('Projet introuvable', HttpStatus.NOT_FOUND)
    }

    return res.send(await this.projectProvider.ping(project.path))
  }

  @Get(':id/logs')
  async getProjectLogs(@Param('id') id: number) {
    return this.appProvider.logs
  }

  @Get('open_in_exporer')
  async openOnExplorer(@Query('cwd') cwd: string) {
    await this.shellCommandsProvider.executeCommand('start .', cwd)
  }

  @Get('open_in_idea')
  async openInIntellijIdea(@Query('cwd') cwd: string) {
    await this.shellCommandsProvider.executeCommand('idea .', cwd)
  }

  @Get('run')
  runApplication(@Query('cwd') cwd: string, @Query('profile') profile: string) {
    return this.projectProvider.runApplication(cwd, profile)
  }

  @Get(':id/exit')
  async exitApplication(@Param('id') id: number, @Res() res: Response) {
    const project = await Project.findOneBy({ id })

    if (project == null) {
      throw new HttpException('Projet introuvable', HttpStatus.NOT_FOUND)
    }

    return res.send(await this.projectProvider.stopApplication(project.path))
  }

  @Get('paths')
  getPaths(@Query('cwd') cwd: string) {
    return { data: this.projectProvider.getProjectPaths(cwd) }
  }

  @Get('appdata')
  getAppData(@Query('cwd') cwd: string) {
    return this.projectProvider.getAppdata(cwd)
  }

  @Get(':id/env_profiles')
  async getEnvProfiles(@Param('id') id: number) {
    const project = await Project.findOneBy({ id })

    if (project == null) {
      throw new HttpException('Projet introuvable', HttpStatus.NOT_FOUND)
    }

    const paths = this.projectProvider.getProjectPaths(project.path)

    const profiles = ['default']
    const files = fs.readdirSync(paths.server_resources_path)

    profiles.push(...files.filter(value => value.startsWith('application-') && value.endsWith('.properties')).map(value => value.match('application-(.*?).properties')[1]))

    return profiles
  }

  @Get('rootdir')
  async getRootDir(@Query('cwd') cwd: string) {
    console.log(cwd)
    const javaFiles = globSync('**/*.java', { cwd, absolute: true })

    return { dirname: javaFiles != null && javaFiles.length > -1 ? javaFiles[0] : null }
  }

  @Get()
  findAll() {
    return Project.find()
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return Project.findOneBy({ id })
  }

  @Post('appdata')
  async recreateAppData(@Body() body: { cwd: string }, @Res({ passthrough: true }) res: Response) {
    try {
      return await this.projectProvider.refreshAppData(body.cwd)
    } catch (err: any) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: err.message })
    }
  }

  @Post()
  async createProject(@Body() body: { name: string, path: string }) {
    const projects: ProjectAttributes[] = await Project.find({ where: { path: path.normalize(body.path) } })

    if (projects.length > 0) {
      throw new HttpException('Projet déjà enregistré', HttpStatus.BAD_REQUEST)
    }

    const project: Project = new Project()
    project.name = body.name
    project.path = path.normalize(body.path)

    await project.save({ reload: true })
    return project
  }

  @Delete(':id')
  async deleteProject(@Param('id') id: number) {
    return Project.delete({ id })
  }

}
