import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import Task from "../src/task.js";

describe("Task Test Suite", () => {
  let _logMock;
  let _task;
  beforeEach(() => {
    _logMock = jest.spyOn(console, console.log.name).mockImplementation();

    _task = new Task();
  });

  it("sould only run tasks that are due with fake timers (fast)", async () => {
    jest.useFakeTimers();

    const tasks = [
      {
        name: "Task-Will-Run-In-5-Seconds",
        dueAt: new Date(Date.now() + 5000),
        fn: jest.fn(),
      },
      {
        name: "Task-Will-Run-In-10-Seconds",
        dueAt: new Date(Date.now() + 10000),
        fn: jest.fn(),
      },
    ];

    _task.save(tasks.at(0));
    _task.save(tasks.at(1));

    _task.run(200);

    jest.advanceTimersByTime(4000);

    // ninguém deve ser executado ainda!
    expect(tasks.at(0).fn).not.toHaveBeenCalled();
    expect(tasks.at(1).fn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(2000);

    // 4 + 2 = 6, só a primeira tarefa deve executar
    expect(tasks.at(0).fn).toHaveBeenCalled();
    expect(tasks.at(1).fn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(4000);

    // 4 + 2 + 4 = 10, a segunda tarefa deve executar
    expect(tasks.at(1).fn).toHaveBeenCalled();

    jest.useRealTimers();
  });
});
