import { generateRandomNumbers , generateUniqueRandomNumbers} from "./generateRandomNumbers.js";
import { run } from "./run.js";

const generateRooms = (count) => {
  const floorIds = generateRandomNumbers(6, 20, count);
  const roomNumbers = generateUniqueRandomNumbers(100, 150, count);
  const statuses = ['AVAILABLE'];

  const rooms = roomNumbers.map((roomNumber, index) => ({
    roomNumber: roomNumber,
    capacity: Math.floor(Math.random() * 4) + 1,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    price: (Math.random() * 100) + 50,
    floorId: floorIds[index]
  }));

  return rooms;
};

const rooms = generateRooms(30);

run(rooms, "/rooms");











