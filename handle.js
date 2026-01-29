import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

/**
 * TFT Trait Data Converter
 * 将 trait.json 转换为 trait-new.json
 * 按照 app/types/trait.ts 中定义的格式
 */

// 获取当前文件目录（ES module 兼容）
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 文件路径
const INPUT_FILE = path.join(__dirname, 'app', 'data', 'trait.json')
const OUTPUT_FILE = path.join(__dirname, 'app', 'data', 'trait-new.json')

/**
 * 转换单个 trait level 数据
 */
function convertTraitLevel(item) {
  return {
    level: item.level,
    needNumber: parseInt(item.num, 10),
    description: item.realDesc,
  }
}

/**
 * 创建新的 Trait 对象
 */
function createTrait(item) {
  return {
    id: parseInt(item.checkId, 10),
    type: item.type === 0 ? 'ORIGIN' : 'CLASS',
    name: item.name,
    cnName: item.name,
    description: item.prefix,
    levels: [],
  }
}

/**
 * 主转换函数
 */
function convertTraits() {
  console.log('🚀 开始转换 trait 数据...\n')

  // 检查输入文件是否存在
  if (!fs.existsSync(INPUT_FILE)) {
    console.error(`❌ 错误: 找不到输入文件 ${INPUT_FILE}`)
    process.exit(1)
  }

  // 读取原始数据
  console.log(`📖 读取文件: ${INPUT_FILE}`)
  const rawData = fs.readFileSync(INPUT_FILE, 'utf8')
  const traitData = JSON.parse(rawData)

  // 用于存储按 checkId 分组的 traits
  const traitMap = new Map()

  // 遍历所有数据
  let processedCount = 0
  Object.values(traitData.data).forEach((item) => {
    const checkId = parseInt(item.checkId, 10)

    // 如果该 checkId 还没有创建 Trait，则创建
    if (!traitMap.has(checkId)) {
      const trait = createTrait(item)
      traitMap.set(checkId, trait)
    }

    // 获取 Trait 并添加 level 信息
    const trait = traitMap.get(checkId)
    trait.levels.push(convertTraitLevel(item))
    processedCount++
  })

  console.log(`📊 处理了 ${processedCount} 条原始数据`)
  console.log(`📦 合并为 ${traitMap.size} 个唯一羁绊\n`)

  // 对 levels 按 level 排序
  traitMap.forEach((trait) => {
    trait.levels.sort((a, b) => a.level - b.level)
  })

  // 转换为数组并按 id 排序
  const traits = Array.from(traitMap.values())
  traits.sort((a, b) => a.id - b.id)

  // 生成 JSON 字符串
  const output = JSON.stringify(traits, null, 2)

  // 确保输出目录存在
  const outputDir = path.dirname(OUTPUT_FILE)
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
    console.log(`📁 创建目录: ${outputDir}`)
  }

  // 写入新文件（覆盖模式）
  fs.writeFileSync(OUTPUT_FILE, output)
  console.log(`✅ 转换完成！`)
  console.log(`📝 输出文件: ${OUTPUT_FILE}`)
  console.log(`📏 文件大小: ${(output.length / 1024).toFixed(2)} KB\n`)

  // 统计信息
  const typeStats = {
    ORIGIN: traits.filter((t) => t.type === 'ORIGIN').length,
    CLASS: traits.filter((t) => t.type === 'CLASS').length,
  }
  console.log('📈 统计信息:')
  console.log(`   - ORIGIN (种族): ${typeStats.ORIGIN} 个`)
  console.log(`   - CLASS (职业): ${typeStats.CLASS} 个`)

  // 验证 checkId=298
  const check298 = traits.find((t) => t.id === 298)
  if (check298) {
    console.log(`\n🔍 checkId=298 验证 (迅击战士):`)
    console.log(`   - 名称: ${check298.name}`)
    console.log(`   - 类型: ${check298.type}`)
    console.log(`   - 等级数: ${check298.levels.length}`)
    console.log(`   - 等级详情:`)
    check298.levels.forEach((lvl) => {
      console.log(`     * Level ${lvl.level}: 需要 ${lvl.needNumber} 个 - ${lvl.description.substring(0, 40)}...`)
    })
  }

  console.log('\n🎉 全部完成！')
  return traits
}

// 执行转换
try {
  convertTraits()
} catch (error) {
  console.error('\n❌ 转换失败:', error.message)
  process.exit(1)
}
