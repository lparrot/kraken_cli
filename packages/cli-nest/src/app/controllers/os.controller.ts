import {Controller, Get, Inject, Query} from '@nestjs/common';
import {basename, dirname, join, normalize, resolve, sep} from "path";
import {homedir, tmpdir} from "os";
import {ShellCommandsProvider} from "src/services/shell-commands.provider";
import * as _ from "lodash";
import {globSync} from "glob";
import {isNotBlank} from "src/utils/string.utils";
import {Path} from "path-scurry";

const globIgnoreFn = (p: Path) => !p.isDirectory()

@Controller('os')
export class OsController {

  @Inject(ShellCommandsProvider) shellCommands: ShellCommandsProvider;

  @Get('infos')
  getInfos() {
    const versions = this.shellCommands.getVersions()
    return {
      ...versions,
      separator: sep,
      home_dir: homedir(),
      root_dir: resolve('/'),
      tmp_dir: tmpdir()
    }
  }

  @Get('path/info')
  getPathInfo(@Query('path') path: string, @Query('root') root: string) {

    let query_path = normalize(path)
    let query_root = normalize(root!)

    function getInfo(dirpath: string) {
      return {
        label: basename(dirpath),
        path: dirpath
      }
    }

    function getBreadcrumb() {
      let bread_path = query_path

      if (isNotBlank(query_root)) {
        bread_path = query_path.replaceAll(query_root!, '')
      } else {
        query_root = ''
      }

      const splitted_bread = bread_path.split(sep)
      const bread_items = []
      let bread_item_path = query_root

      for (let i = 0; i < splitted_bread.length; i++) {
        if (isNotBlank(splitted_bread[i])) {
          bread_item_path = join(bread_item_path!, splitted_bread[i])
          bread_items.push({
            path: bread_item_path + sep,
            label: splitted_bread[i]
          })
        }
      }
      return bread_items
    }

    return {
      ...getInfo(query_path),
      parent: query_path === resolve('/') ? undefined : dirname(query_path),
      breadcrumb: getBreadcrumb(),
      children: _.sortBy(globSync('*', {cwd: query_path, absolute: true, ignore: {ignored: globIgnoreFn}})).map(f => getInfo(f))
    }
  }
}
