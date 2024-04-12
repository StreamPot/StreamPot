create table jobs (
  id varchar(255) primary key,
  user_id varchar(255) not null,
  status text not null,
  output_url text,
  created_at timestamp default current_timestamp,
  completed_at timestamp 
);