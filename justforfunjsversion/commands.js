const { Route, findRouteByNumber, doesRouteExist,
        findRouteByTicket } = require('./routes.js');

const checkInt = (s_int, name) => {
  const res = parseInt(s_int);
  if(!isNaN(res)){
    return res;
  } else {
    throw new Error(name + ' has to be a number');
  }
};

const commands = {
  registerroute: (db, s_rNum, src, dest, s_seats) => {
    const rNum = checkInt(s_rNum, 'Routenumber');
    const seats = checkInt(s_seats, 'Seats');
    if(doesRouteExist(db, rNum)){
      throw new Error('Route with this number exists');
    }

    const route = new Route(rNum, src, dest, seats);

    db.routes.push(route);
    return db;
  },
  deleteroute: (db, rNum) => {
    const route = findRouteByNumber(db, rNum);
    if(route.tickets.length > 0){
      throw new Error('Cannot delete route with booked tickets');
    } else {
      delete db.routes[route];
    }
  },
  depart: (db, s_rNum) => {
    const rNum = checkInt(s_rNum, 'Routenumber');
    const route = findRouteByNumber(db, rNum);
    route.depart();
    return db;
  },
  status: (db, s_rNum) => {
    if(s_rNum){
      const rNum = checkInt(s_rNum, 'Routenumber');
      throw new Error('Not implemented');
    }
    const message = db.routes
          .map(route => {
            const free = route.seats - route.tickets.length;
            let status = '';
            if(route.isTraveling()){
              status = 'travelling';
            } else {
              status = free === 0 ? 'full' :
                  free < route.seats ? 'availabe' : 'empty';
            }
            return `${route.number}: ${route.source} - ${route.destination} (${route.seats}, ${status})`;
          }
               )
          .join('\n');
    console.log(message);
  },
  buy: (db, s_rNum) => {
    const rNum = checkInt(s_rNum);
    const route = findRouteByNumber(db, rNum);
    const tNum = route.buyTicket(db);
    console.log(`Ticket ${tNum}: ${route.number}, ${route.source} - ${route.destination}`);
    return db;
  },
  checkin: (db, s_tNum) => {
    const tNum = checkInt(s_tNum);
    const route = findRouteByTicket(db, tNum);
    const seatNum = route.checkin(tNum);
    console.log(`Ticket ${tNum} with Seat ${seatNum}: ${route.number}, ${route.source} - ${route.destination}`);
    return db;
  },
  cancel: (db, s_tNum) => {
    const tNum = checkInt(s_tNum);
    const route = findRouteByTicket(db, tNum);
    route.cancel(tNum);
    return db;
  }
};

module.exports = commands;
