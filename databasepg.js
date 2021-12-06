const { Client } = require('pg');

const client = new Client({
  user: 'qeqcuvnhnwjrdd',
  password: '2510fb215d00cbdbf62c1f3d14f46f1d650e740f0b948993b8d19c8ee7a08457',
  host: 'ec2-3-228-86-183.compute-1.amazonaws.com',
  port: 5432,
  database: 'dbuicumbf66i2h',
});

client.connect();

client.query(`Select * from users`, (err, res) => {
  if (!err) console.log(res.rows);
  else console.log(err.message);
  client.end;
});
