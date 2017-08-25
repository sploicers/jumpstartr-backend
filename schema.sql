create Table if not exists User(
	user_id int auto_increment,
	username varchar(20) not null,
	user_location varchar(20) not null, //remove not null later
	email varchar(50) not null,
	password varchar(20) not null,describ
	active bool default true,
	primary key (user_id)
);

create Table if not exists Project( 
	project_id int auto_increment,
	title varchar(100) not null,
	subtitle varchar(100),
	description varchar(200) not null,
    imgUri varchar(100),
	target int not null,
	total_raised int default 0,
	funded bool default false,
    created_on timestamp not null default now(),
	open bool default true,
	
	primary key (project_id)
);

create Table if not exists ProjectReward(
	reward_id int auto_increment,
	project_id int,
	amount int not null,
	description varchar(200),
	foreign key (project_id) references Project(project_id),
	primary key (reward_id)
);

create Table if not exists ProjectOwner(
	project_id int,
	user_id int,
	primary key(project_id, user_id),
	foreign key (project_id) references Project(project_id),
	foreign key (user_id) references User(user_id)
);

create Table if not exists ProjectBacker(
	project_id int,
	user_id int,
	anonymous bool default false,
	amount int not null,
	pledge_time timestamp default now(),
	primary key (project_id, user_id, pledge_time),
	foreign key (project_id) references Project(project_id),
	foreign key (user_id) references User(user_id)
);

create Table if not exists PaymentMethod(
	user_id int,
	auth_token varchar(20) not null,
	primary key (user_id, auth_token),
	foreign key (user_id) references User(user_id)
);

create Table if not exists Session(
	user_id int,
	auth_token varchar,
	primary_key (user_id, auth_token),
	foreign_key (user_id) references User(user_id)
);


insert into User(username, user_location, email, password) values 
	("Josh", "Christchurch", "jwt52@uclive.ac.nz", "password"),
	("Xavier", "Wellington", "xav97@hotmail.com", "abc123"),
	("James", "Auckland", "fakename@fakemail.com", "cats"),
	("Jenny", "Dunedin", "jenjen55@live.com", "d5hp!@wg4gff4"),
	("Ivan", "Moscow", "youngrussiansfordemocracy@gmail.com", "m0th3rl4nd");


insert into Project(title, subtitle, description, target) values
	("Make The Motherland Great Again", null, "Donate to Young Russians For Democracy!", 500000),
	("Help get me to Africa", null, "Heading to Africa for volunteer work, help sponsor me :)", 800000);
	
insert into ProjectOwner values (1, 5), (2, 2);




