
class Route {

  constructor(rNum, src, dest, seats){
    this.number = rNum;
    this.source = src;
    this.destination = dest;
    this.seats = seats;
    this.tickets = [];
  }

  checkRoute (){
    if(!this.isTraveling() && this.startedAt){
      delete this.startedAt;
      const dest = this.source;
      this.source = this.destination;
      this.destination = dest;
      this.tickets = [];
    }
  }

  isTraveling() {
    if(this.startedAt
       && this.startedAt + 1000 * 10 > new Date().getTime()){
      return true;
    }
    return false;
  }

  depart(){
    if(this.isTraveling()){
      throw new Error('Is traveling already');
    }
    this.startedAt = new Date().getTime();
  }

  buyTicket(db){
    if(this.seats <= this.tickets.length){
      throw new Error('Sorry! You were too late! Tickets are sold out!');
    } else {
      const tNum = db.ticketCounter++;
      this.tickets.push({ number: tNum });
      return tNum;
    }
  }

  checkin(tNum){
    const ticket = this.tickets.find(
      ticket => ticket.number === tNum);
    if(ticket.checkedIn){
      throw new Error('Ticket already in use');
    }
    ticket.checkedIn = true;
    return this.tickets.filter(
      ticket => ticket.checkedIn).length + 1;
  }

  cancel(tNum){
    const ticket = this.tickets.find(
      ticket => ticket.number === tNum);
    if(ticket.checkedIn){
      throw new Error('Ticket already in use');
    }
    this.tickets = this.tickets.filter(
      ticket => ticket.number !== tNum);
  }

  // ###

  static fromObj(obj){
    const { rNum, src, dest, seats, tickets } = obj;
    const res = new Route(rNum, src, dest, seats);
    res.startedAt = obj.startedAt;
    res.tickets = tickets;
    return res;
  }

  toObj(){
    return {rNum : this.number,
            src : this.source,
            dest : this.destination,
            seats : this.seats,
            tickets : this.tickets,
            startedAt : this.startedAt
           };
  }
}

const checkRoutes = db => {
  db.routes.forEach(route => route.checkRoute());
  return db;
};

const findRouteByNumber = (db, number) => {
  const routes = db.routes
        .filter(route => route.number === number);
  if(routes.length !== 1){
    throw new Error('Route does not exist');
  }
  return routes[0];
};

const findRouteByTicket = (db, number) => {
  const routes = db.routes
        .filter(
          route => route.tickets.filter(
            ticket => ticket.number === number).length > 0);
  if(routes.length !== 1){
    throw new Error('Ticket does not exist');
  }
  return routes[0];
};

const doesRouteExist = (db, number) => {
  const routes = db.routes
        .filter(route => route.number === number);
  return routes.length === 1;
};

module.exports = { Route, checkRoutes, findRouteByNumber,
                   doesRouteExist, findRouteByTicket };
