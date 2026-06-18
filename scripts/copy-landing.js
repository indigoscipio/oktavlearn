import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'fs'
import { join } from 'path'

function copyDir(source, target) {
  if (!existsSync(target)) mkdirSync(target, { recursive: true })
  for (const entry of readdirSync(source)) {
    const sourcePath = join(source, entry)
    const targetPath = join(target, entry)
    if (statSync(sourcePath).isDirectory()) {
      copyDir(sourcePath, targetPath)
    } else {
      copyFileSync(sourcePath, targetPath)
    }
  }
}

copyFileSync('landing/index.html', 'dist/index.html')
copyDir('public', 'dist')
