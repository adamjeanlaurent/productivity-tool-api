import fsSync from 'fs';
import fsAsync from 'fs/promises';

export default class FileSystem {
    static createFile(filepath: string): void {
        if(this.exists(filepath))
            this.delete(filepath);
        fsSync.closeSync(fsSync.openSync(filepath, 'w'));
    }

    static createDirectory(filepath: string): void {
        if(!this.exists(filepath))
            fsSync.mkdir(
                filepath, 
                (err: NodeJS.ErrnoException | null, path?: string | undefined) => {} // :/ had to add this callback for sync method
            );
    }

    static delete(filepath: string): void {
        if(this.exists(filepath))
            fsSync.unlinkSync(filepath);
    }

    static exists(filepath: string): boolean {
       return fsSync.existsSync(filepath);
    }

    static write(filepath: string, line: string): void {
        if(!this.exists(filepath)) {
            this.createFile(filepath);
        }
            
        fsSync.appendFileSync(filepath, line);
    }

    static readUTF8(filepath: string): string[] {
        const data: string = fsSync.readFileSync(filepath, { encoding:'utf8', flag:'r' });
        const lines: string[] = data.split(/\r?\n/);
        return lines;
    }
}

module.exports = FileSystem;