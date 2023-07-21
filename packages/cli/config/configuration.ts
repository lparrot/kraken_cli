import {readFileSync} from 'fs';
import * as yaml from 'js-yaml';
import {join} from 'path';
import {flattenObject} from "../src/utils/object.utils";

const YAML_CONFIG_FILENAME = 'config.yaml';

export default () => {
  const configs = yaml.load(readFileSync(join(__dirname, YAML_CONFIG_FILENAME), 'utf8')) as Record<string, any>;
  const flat_config: any = flattenObject(configs);

  for (const key in flat_config) {
    process.env[key] = flat_config[key]
  }

  return configs;
};
