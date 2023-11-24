import { Project } from "@/types/project";
import moment from "moment-timezone";

export const projects = [
    {
        _id: "1",
        title: "project1",
        description: "project1",
        status: "completed",
        archived: false,
        pinned: false,
        created_at: moment().subtract(30, "days").toDate(),
        updated_at: moment().subtract(15, "days").toDate(),
    } as Project,
    {
        _id: "2",
        title: "test",
        description: "test",
        status: "in_progress",
        archived: false,
        pinned: true,
        created_at: moment().subtract(22, "days").toDate(),
        updated_at: moment().subtract(1, "days").toDate(),
    } as Project,
    {
        _id: "3",
        title: "zxcvbnm",
        description: "zxcvbnm",
        status: "not_started",
        archived: false,
        pinned: true,
        created_at: moment().subtract(23, "days").toDate(),
        updated_at: moment().subtract(5, "days").toDate(),
    } as Project,
    {
        _id: "4",
        title: "example",
        description: "example",
        status: "completed",
        archived: false,
        pinned: false,
        created_at: moment().subtract(10, "days").toDate(),
        updated_at: moment().subtract(3, "days").toDate(),
    } as Project,
    {
        _id: "5",
        title: "project5",
        description: "project5",
        status: "completed",
        archived: false,
        pinned: false,
        created_at: moment().subtract(11, "days").toDate(),
        updated_at: moment().subtract(10, "days").toDate(),
    } as Project,
];

export const projectsSortedByTitleAZ = [
    projects[1],
    projects[2],
    projects[3],
    projects[0],
    projects[4],
];

export const projectsSortedByTitleZA = [
    projects[2],
    projects[1],
    projects[4],
    projects[0],
    projects[3],
];

export const projectsSortedByCreationDateCDESC = [
    projects[1],
    projects[2],
    projects[3],
    projects[4],
    projects[0],
];

export const projectsSortedByCreationDateCASC = [
    projects[2],
    projects[1],
    projects[0],
    projects[4],
    projects[3],
];

export const projectsSortedByLastUpdateUDESC = [
    projects[1],
    projects[2],
    projects[3],
    projects[4],
    projects[0],
];

export const projectsSortedByLastUpdateUASC = [
    projects[2],
    projects[1],
    projects[0],
    projects[4],
    projects[3],
];
