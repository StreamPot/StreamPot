import database from "./database";
import queue from "./queue";
import filesystems from "./filesystems";
import { FilesystemsConfig, DiskConfig } from "./filesystems";

export default {
    database,
    queue,
    filesystems,
};

export type {
    FilesystemsConfig,
    DiskConfig,
}
