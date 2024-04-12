create table jobs (
  id serial primary key,
  type varchar(255) not null,
  user_id varchar(255) not null,
  status text not null,
  source_url text,
  output_url text,
  payload jsonb,
  created_at timestamp default current_timestamp,
  completed_at timestamp 
);