import {Command, CommandRunner, Option} from "nest-commander";
import {spawn} from "child_process";
import {NestFactory} from "@nestjs/core";
import {AppModule} from "../../../app/app.module";

@Command({
  name: 'ui',
  description: 'Ouvre une interface utilisateur dans le navigateur'
})
export class UiCommand extends CommandRunner {
  async run(inputs: string[], options: Record<string, string>): Promise<void> {
    const port = parseInt(process.env['app.port'])

    if (options.open) {
      spawn(`start http://localhost:${port}`, {shell: true, detached: true})
    }

    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('/api')
    await app.listen(port, () => console.log(`Listening on port ${port}`));
  }

  @Option({
    flags: '-o, --open',
    description: `Ouvre un navigateur automatiquement pour afficher l'interface utilisateur'`,
  })
  open() {
    return true;
  }
}
