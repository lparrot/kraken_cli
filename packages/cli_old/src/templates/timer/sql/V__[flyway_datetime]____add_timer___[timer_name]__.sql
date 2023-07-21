INSERT INTO `socle_timers` (`name`, `automatic`, `day_of_month`, `day_of_week`, `description`, `hours`, `job_class`, `minutes`, `month`, `seconds`, `year`)
VALUES ('<%= timer_name %>', 0, '?', '*', '<%= timer_description %>', '*', '<%= timer_package == '' ? '' : timer_package + '.' %><%= timer_class %>', '*/1', '*', '0', '*');
