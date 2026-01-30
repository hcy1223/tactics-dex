import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

/**
 * TFT Unit Data Converter
 * 将 chess.json 转换为 units.json，并下载图片到本地
 * 按照 app/types/unit.ts 中定义的结构
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CHESS_FILE = path.join(__dirname, 'app', 'data', 'chess.json');
const TRAIT_FILE = path.join(__dirname, 'app', 'data', 'trait-new.json');
const OUTPUT_FILE = path.join(__dirname, 'app', 'data', 'units.json');
const IMAGES_DIR = path.join(__dirname, 'public', 'images', 'units');

/**
 * 加载并解析 JSON 文件
 */
function loadJSON(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`文件不存在: ${filePath}`);
  }
  const content = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(content);
}

/**
 * 确保目录存在
 */
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`📁 创建目录: ${dirPath}`);
  }
}

/**
 * 延迟函数
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 下载图片到本地（如果文件已存在则跳过）
 * 修复: 正确处理错误，避免生成0B文件
 * 新增: 添加1秒延迟避免限流
 */
async function downloadImageWithDelay(url, filePath) {
  // 检查文件是否已存在
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    if (stats.size > 0) {
      console.log(`   ⏭️  图片已存在，跳过: ${path.basename(filePath)}`);
      return true;
    } else {
      // 如果文件存在但大小为0，删除它并重新下载
      console.log(`   🗑️  删除0B文件: ${path.basename(filePath)}`);
      fs.unlinkSync(filePath);
    }
  }
  
  // 添加1秒延迟避免限流
  await sleep(1000);
  
  return new Promise((resolve) => {
    const file = fs.createWriteStream(filePath);
    let fileSize = 0;
    
    https.get(url, (response) => {
      // 检查内容类型
      const contentType = response.headers['content-type'];
      if (contentType && !contentType.startsWith('image/')) {
        file.destroy();
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath); // 删除无效文件
        }
        console.warn(`⚠️  无效的URL (非图片): ${url}`);
        resolve(false);
        return;
      }
      
      if (response.statusCode === 200) {
        response.on('data', (chunk) => {
          fileSize += chunk.length;
        });
        
        response.pipe(file);
        
        file.on('finish', () => {
          file.close(() => {
            // 验证文件大小
            if (fileSize > 0) {
              console.log(`   📥 下载图片: ${path.basename(filePath)} (${(fileSize / 1024).toFixed(2)} KB)`);
              resolve(true);
            } else {
              if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath); // 删除0B文件
              }
              console.warn(`⚠️  下载失败 (文件大小为0): ${url}`);
              resolve(false);
            }
          });
        });
        
        // 处理响应错误
        response.on('error', (err) => {
          file.destroy();
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath); // 删除可能损坏的文件
          }
          console.warn(`⚠️  响应错误: ${err.message}`);
          resolve(false);
        });
      } else {
        file.destroy();
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath); // 删除无效文件
        }
        console.warn(`⚠️  下载失败 (状态码 ${response.statusCode}): ${url}`);
        resolve(false);
      }
    }).on('error', (err) => {
      file.destroy();
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); // 删除可能损坏的文件
      }
      console.warn(`⚠️  下载错误: ${err.message}`);
      resolve(false);
    });
    
    // 处理文件流错误
    file.on('error', (err) => {
      file.destroy();
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      console.warn(`⚠️  文件流错误: ${err.message}`);
      resolve(false);
    });
  });
}

/**
 * 解析羁绊 ID 字符串
 */
function parseTraitIds(traitStr) {
  if (!traitStr || traitStr === '-1') return [];
  return traitStr.split('|').filter(id => id && id !== '-1');
}

/**
 * 查找 Trait 对象
 */
function findTrait(traitId, traits) {
  const id = parseInt(traitId, 10);
  return traits.find(t => t.id === id);
}

/**
 * 转换单个 Unit
 */
function convertUnit(item, allTraits, imagePath) {
  const unit = {
    id: parseInt(item.id, 10),
    name: item.name,
    cost: parseInt(item.price, 10),
    image: imagePath, // 使用相对路径
    traits: [],
    skill: {
      name: item.skillName || '',
      description: item.skillDesc || ''
    }
  };

  // 处理羁绊
  const traitIds = [];
  
  if (item.species && item.species !== '-1') {
    traitIds.push(...parseTraitIds(item.species));
  }
  
  if (item.class && item.class !== '-1') {
    traitIds.push(...parseTraitIds(item.class));
  }

  // 去重并转换为 Trait 对象
  const uniqueTraitIds = [...new Set(traitIds)];
  unit.traits = uniqueTraitIds
    .map(id => findTrait(id, allTraits))
    .filter(t => t !== undefined);

  return unit;
}

/**
 * 主转换函数
 */
async function convertUnits() {
  console.log('🚀 开始转换 Unit 数据（含图片下载）...\n');

  // 加载数据
  console.log('📖 加载 Chess 数据...');
  const chessData = loadJSON(CHESS_FILE);
  
  console.log('📖 加载 Trait 数据...');
  const traitData = loadJSON(TRAIT_FILE);

  const allTraits = Array.isArray(traitData) ? traitData : traitData.data || [];
  const allUnits = chessData.data || chessData;

  console.log(`📊 找到 ${Object.keys(allUnits).length} 个原始单位`);
  console.log(`📊 找到 ${allTraits.length} 个羁绊定义\n`);

  // 确保图片目录存在
  ensureDirectoryExists(IMAGES_DIR);

  // 转换所有单位
  const convertedUnits = [];
  let skipped = 0;
  let downloadFailed = 0;

  const unitPromises = Object.values(allUnits).map(async (item) => {
    try {
      // 跳过无效单位
      if (parseInt(item.price, 10) === 0 && item.name.includes('假人')) {
        skipped++;
        return null;
      }

      // 下载图片（带1秒延迟避免限流）
      const imageFileName = `${item.id}.png`;
      const localImagePath = path.join(IMAGES_DIR, imageFileName);
      
      // 使用 heroPaint 生成的URL（第二种图片类型）
      const heroPaintUrl = `https://game.gtimg.cn/images/jk/jkimg/mode16s17/1624x750/${item.heroPaint}.jpg`;
      
      let imageDownloaded = false;
      if (item.heroPaint && item.heroPaint !== '') {
        imageDownloaded = await downloadImageWithDelay(heroPaintUrl, localImagePath);
      }

      if (!imageDownloaded) {
        downloadFailed++;
        console.warn(`⚠️  图片下载失败，跳过单位: ${item.name} (ID: ${item.id})`);
        return null;
      }

      // 转换数据 - 使用 public 目录路径（Nuxt 静态资源）
      const relativeImagePath = `/images/units/${imageFileName}`;
      const unit = convertUnit(item, allTraits, relativeImagePath);
      return unit;
    } catch (error) {
      console.warn(`⚠️  处理单位 ${item.id} 时出错: ${error.message}`);
      return null;
    }
  });

  // 等待所有单位处理完成
  const results = await Promise.all(unitPromises);
  convertedUnits.push(...results.filter(u => u !== null));

  console.log(`\n✅ 成功转换 ${convertedUnits.length} 个单位`);
  if (skipped > 0) {
    console.log(`⏭️  跳过 ${skipped} 个测试/无效单位`);
  }
  if (downloadFailed > 0) {
    console.log(`❌ ${downloadFailed} 个单位图片下载失败`);
  }

  // 按 ID 排序
  convertedUnits.sort((a, b) => a.id - b.id);

  // 生成 JSON
  const output = JSON.stringify(convertedUnits, null, 2);

  // 确保输出目录存在
  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 写入文件
  fs.writeFileSync(OUTPUT_FILE, output);
  console.log(`\n✅ 转换完成！`);
  console.log(`📝 输出文件: ${OUTPUT_FILE}`);
  console.log(`📏 文件大小: ${(output.length / 1024).toFixed(2)} KB`);
  console.log(`📁 图片目录: ${IMAGES_DIR}`);

  // 验证特定 ID
  const testId = 23332;
  const testUnit = convertedUnits.find(u => u.id === testId);
  if (testUnit) {
    console.log(`\n🔍 ID=${testId} 的单位验证 (金克丝):`);
    console.log(`   - 名称: ${testUnit.name}`);
    console.log(`   - 费用: ${testUnit.cost}`);
    console.log(`   - 图片路径: ${testUnit.image}`);
    console.log(`   - 羁绊数: ${testUnit.traits.length}`);
    testUnit.traits.forEach(t => {
      console.log(`     * ${t.name} (${t.type})`);
    });
  } else {
    console.log(`\n⚠️  未找到 ID=${testId} 的单位`);
  }

  return convertedUnits;
}

// 执行转换
convertUnits().then(() => {
  console.log('\n🎉 全部完成！');
}).catch((error) => {
  console.error('\n❌ 转换失败:', error.message);
  console.error(error.stack);
  process.exit(1);
});
