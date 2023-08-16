import {Body, Controller, Get, HttpException, HttpStatus, Post, Query} from "@nestjs/common";
import {globSync} from "glob";
import {PostFsDirBody} from "@kraken/types";
import * as fs from "fs";
import * as path from "path";

const shelljs = require('shelljs')

@Controller('fs')
export class FilesystemController {

    @Get('files/java')
    async getFilesJava(@Query('cwd') cwd: string) {
        return globSync('**/*.java', {cwd, absolute: true})
    }

    @Post('dir')
    async postDir(@Body() body: PostFsDirBody) {
        const dir = fs.readdirSync(body.cwd)

        if (dir.indexOf(body.name) > -1) {
            throw new HttpException('Dossier deja existant', HttpStatus.BAD_REQUEST)
        }

        fs.mkdirSync(path.join(body.cwd, body.name))
    }

}
