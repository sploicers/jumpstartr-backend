create table if not exists Users(
	user_id int auto_increment,
	username varchar(20) not null,
	user_location varchar(20) not null,
	email varchar(50) not null,
	password varchar(20) not null,
	primary key (user_id)
);

create table if not exists Projects(
	project_id int auto_increment,
	title varchar(100) not null,
	subtitle varchar(100),
	description varchar(200),
	target int not null,
	created_on timestamp not null default now(),
	primary key (project_id)
);

create table if not exists ProjectOwners(
	project_id int,
	user_id int,
	primary key (project_id, user_id),
	foreign key (project_id) references Projects(project_id),
	foreign key (user_id) references Users (user_id)
);

create table if not exists Rewards(
	reward_id int auto_increment,
	project_id int,
	amount int not null,
	description varchar(200),
	foreign key (project_id) references Projects(project_id),
	primary key (reward_id)
);

create table if not exists Pledges(
	project_id int,
	user_id int,
	amount int not null,
	anonymous bool not null,
	foreign key (user_id) references Users(user_id),
	primary key (project_id, user_id)
);

create table if not exists Card (
	auth_token varchar(10) not null,
	card_owner int,
	primary key (auth_token),
	foreign key (card_owner) references Users(user_id)
);
/*
create table if not exists UserPayment(
	auth_token varchar(10),
	user_id int,
	primary key(auth_token, user_id),
	foreign key (auth_token) references Card(auth_token),
	foreign key (user_id) references Users(user_id)
);*/

create table if not exists LoginSession(
	user_id int,
	password varchar(20),
	logged_in bool not null,
	primary key (user_id, pass),
	foreign key (user_id) references Users(user_id),
	foreign key (password) references Users(password)
);


insert into Users(username, user_location, email, password) values 
	("Josh", "Christchurch", "jwt52@uclive.ac.nz", "password"),
	("Xavier", "Wellington", "xav97@hotmail.com", "abc123"),
	("James", "Auckland", "fakename@fakemail.com", "cats"),
	("Jenny", "Dunedin", "jenjen55@live.com", "d5hp!@wg4gff4"),
	("Ivan", "Moscow", "youngrussiansfordemocracy@gmail.com", "m0th3rl4nd");
	
insert into Projects(title, subtitle, description, target) values
	("Make The Motherland Great Again", "Donate to Young Russians For Democracy!", null, 500000),
	("Help get me to Africa", "Heading to Africa for volunteer work, help sponsor me :)", null, 800000);  
	
insert into ProjectOwners values (1, 5), (2, 2);
	





	


