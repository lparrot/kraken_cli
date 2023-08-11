import {Controller, Get, Query} from "@nestjs/common";
import {globSync} from "glob";

const shelljs = require('shelljs')

@Controller('fs')
export class FilesystemController {

    @Get('files/java')
    async getFilesJava(@Query('cwd') cwd: string) {
        return globSync('**/*.java', {cwd, absolute: true})
    }

}
