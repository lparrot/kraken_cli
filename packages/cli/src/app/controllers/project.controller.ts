import {Body, Controller, Get, HttpStatus, Inject, Param, Post, Query, Res} from "@nestjs/common";
import {Response} from "express";
import {Project} from "src/app/entities/models/project.entity";
import {ShellCommandsProvider} from "src/services/shell-commands.provider";
import {ProjectProvider} from "src/services/project.provider";
import {AppProvider} from "src/app/app.provider";

@Controller('projects')
export class ProjectController {

  @Inject(ProjectProvider) projectProvider: ProjectProvider;
  @Inject(ShellCommandsProvider) shellCommandsProvider: ShellCommandsProvider;
  @Inject(AppProvider) appProvider: AppProvider;

  @Get(':id/ping')
  async getProjectPing(@Param('id') id: number) {
    const project = await Project.findOneBy({id})

    if (project == null) {
      return {success: false}
    }

    const project_ping = await this.projectProvider.ping(project.path);
    return {success: project_ping}
  }

  @Get(':id/logs')
  async getProjectLogs(@Param('id') id: number) {
    return this.appProvider.logs
  }

  @Get('run')
  runApplication(@Query('cwd') cwd: string) {
    return this.shellCommandsProvider.runApplication(cwd)
  }

  @Get(':id/exit')
  async exitApplication(@Param("id") id: number) {
    const project = await Project.findOneBy({id})

    if (project == null) {
      return {success: false}
    }

    const project_exit = await this.projectProvider.stopApplication(project.path);
    return {success: project_exit}
  }

  @Get('paths')
  getPaths(@Query('cwd') cwd: string) {
    return {data: this.projectProvider.getProjectPaths(cwd)}
  }

  @Get('appdata')
  getAppData(@Query('cwd') cwd: string) {
    return this.projectProvider.getAppdata(cwd)
  }

  @Post('appdata')
  async recreateAppData(@Body() body: { cwd: string }, @Res({passthrough: true}) res: Response) {
    try {
      return await this.projectProvider.refreshAppData(body.cwd)
    } catch (err: any) {
      return res.status(HttpStatus.BAD_REQUEST).json({message: err.message})
    }
  }

  @Get()
  findAll() {
    return Project.find()
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return Project.findOneBy({id})
  }

}
