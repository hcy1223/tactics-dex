import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

/**
 * TFT Unit Data Converter
 * 将 chess.json 转换为 units.json
 * 按照 app/types/unit.ts 中定义的结构
 */

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const CHESS_FILE = path.join(__dirname, 'app', 'data', 'chess.json')
const TRAIT_FILE = path.join(__dirname, 'app', 'data', 'trait-new.json')
const OUTPUT_FILE = path.join(__dirname, 'app', 'data', 'units.json')

/**
 * 加载并解析 JSON 文件
 */
function loadJSON(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`文件不存在: ${filePath}`)
  }
  const content = fs.readFileSync(filePath, 'utf8')
  return JSON.parse(content)
}

/**
 * 解析羁绊 ID 字符串（可能包含多个，用|分隔）
 */
function parseTraitIds(traitStr) {
  if (!traitStr || traitStr === '-1') return []
  return traitStr.split('|').filter((id) => id && id !== '-1')
}

/**
 * 查找 Trait 对象
 */
function findTrait(traitId, traits) {
  const id = parseInt(traitId, 10)
  return traits.find((t) => t.id === id)
}

/**
 * 转换单个 Unit
 */
function convertUnit(item, allTraits) {
  const unit = {
    id: parseInt(item.id, 10),
    name: item.name,
    cost: parseInt(item.price, 10),
    image: item.picture,
    traits: [],
    skill: {
      name: item.skillName || '',
      description: item.skillDesc || '',
    },
  }

  // 处理羁绊
  const traitIds = []

  // 处理 species (种族/起源)
  if (item.species && item.species !== '-1') {
    traitIds.push(...parseTraitIds(item.species))
  }

  // 处理 class (职业)
  if (item.class && item.class !== '-1') {
    traitIds.push(...parseTraitIds(item.class))
  }

  // 去重并转换为 Trait 对象
  const uniqueTraitIds = [...new Set(traitIds)]
  unit.traits = uniqueTraitIds
    .map((id) => findTrait(id, allTraits))
    .filter((t) => t !== undefined)

  return unit
}

/**
 * 主转换函数
 */
function convertUnits() {
  console.log('🚀 开始转换 Unit 数据...\n')

  // 加载数据
  console.log('📖 加载 Chess 数据...')
  const chessData = loadJSON(CHESS_FILE)

  console.log('📖 加载 Trait 数据...')
  const traitData = loadJSON(TRAIT_FILE)

  const allTraits = Array.isArray(traitData) ? traitData : traitData.data || []
  const allUnits = chessData.data || chessData

  console.log(`📊 找到 ${Object.keys(allUnits).length} 个原始单位`)
  console.log(`📊 找到 ${allTraits.length} 个羁绊定义\n`)

  // 转换所有单位
  const convertedUnits = []
  let skipped = 0

  Object.values(allUnits).forEach((item) => {
    try {
      const unit = convertUnit(item, allTraits)

      // 跳过无效单位（例如测试用的木桩假人）
      if (unit.cost === 0 && unit.name.includes('假人')) {
        skipped++
        return
      }

      convertedUnits.push(unit)
    } catch (error) {
      console.warn(`⚠️  处理单位 ${item.id} 时出错: ${error.message}`)
    }
  })

  console.log(`✅ 成功转换 ${convertedUnits.length} 个单位`)
  if (skipped > 0) {
    console.log(`⏭️  跳过 ${skipped} 个测试/无效单位\n`)
  }

  // 按 ID 排序
  convertedUnits.sort((a, b) => a.id - b.id)

  // 生成 JSON
  const output = JSON.stringify(convertedUnits, null, 2)

  // 确保输出目录存在
  const outputDir = path.dirname(OUTPUT_FILE)
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
    console.log(`📁 创建目录: ${outputDir}`)
  }

  // 写入文件
  fs.writeFileSync(OUTPUT_FILE, output)
  console.log(`\n✅ 转换完成！`)
  console.log(`📝 输出文件: ${OUTPUT_FILE}`)
  console.log(`📏 文件大小: ${(output.length / 1024).toFixed(2)} KB`)

  // 验证特定 ID
  const testId = 23332
  const testUnit = convertedUnits.find((u) => u.id === testId)
  if (testUnit) {
    console.log(`\n🔍 ID=${testId} 的单位验证:`)
    console.log(`   - 名称: ${testUnit.name}`)
    console.log(`   - 费用: ${testUnit.cost}`)
    console.log(`   - 羁绊数: ${testUnit.traits.length}`)
    testUnit.traits.forEach((t) => {
      console.log(`     * ${t.name} (${t.type})`)
    })
  } else {
    console.log(`\n⚠️  未找到 ID=${testId} 的单位`)
  }

  return convertedUnits
}

// 执行转换
try {
  convertUnits()
  console.log('\n🎉 全部完成！')
} catch (error) {
  console.error('\n❌ 转换失败:', error.message)
  console.error(error.stack)
  process.exit(1)
}
