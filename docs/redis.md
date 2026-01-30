# 初识Redis

> Redis是一种基于键值对（key-value)的NoSQL数据库；

```js
值可以为：
1. string: 字符串
2. hash： 哈希
3. list： 列表
4. set：集合
5. zset：有序集合
6. Bitmaps：位图
7. HyperLogLog：基数统计
8. GEO：地理信息定位
等
```

## 特性

1. 速度快：存在内存中；C语言实现；单线程架构
2. 基于键值对的数据结构服务器
3. 丰富的功能
    - 键过期功能，用来实现缓存
    - 发布订阅功能给，实现消息系统
    - lua脚本，创造新的Redis命令
    - 事务功能，保证事务特性
    - 流水线功能（pipeline）,一批命令一次性传递到Redis,减少网络开销
4. 简单稳定
5. 客户端语言多
6. 持久化： RDB和AOF
7. 主从复制
8. 高可用和分布式

## 应用场景

1. 缓存
2. 排行榜系统
3. 计数器应用
4. 社交网络
5. 消息队列系统：发布订阅和阻塞队列

## 安装

```js
wget https://download.redis.io/releases/redis-6.2.6.tar.gz
tar xzf redis-6.2.6.tar.gz
ln -s redis-6.2.6 redis
cd redis-6.2.6
make
make install
```
1. 下载Redis安装包
2. 解压安装包
3. 创建软链接
4. 进入Redis目录
5. 编译Redis
6. 安装Redis

```js
redis-cli -v
# 输出：redis-cli 6.2.6
redis-server
# 版本：Redis 6.2.6
# 默认端口号：6379
将配置写到/opt/redis/redis.conf
# 启动Redis服务
redis-server /opt/redis/redis.conf

redis-cli -h 127.0.0.1 -p 6379
redis-cli -h 127.0.0.1 -p 6379 get hello

redis-cli shutdown nosave | save  
# 关闭Redis服务
# nosave：不保存数据
# save：保存数据

```

## 版本号

版本号第二位为奇数：表示开发版本，可能包含新功能和 bug 修复。
版本号第二位为偶数：表示稳定版本，适合生产环境使用。

# API的理解和使用

```js
keys * # 查看所有键
dbsize # 查看数据库中键的数量
exists key # 查看键是否存在
del key # 删除键
expire key seconds # 设置键的过期时间，单位为秒 -1: 没有设置过期时间 -2：键不存在
type key # 查看键的数据类型 不存在返回none
    - string
    - hash
    - list
        - linkedlist
        - ziplist
        - quicklist
        - object encoding hello # 查看字符串的编码方式
    - set
    - zset
ttl key # 查看键的过期时间，单位为秒
```
## 单线程架构

为什么单线程还能这么快？
1. 纯内存访问
2. 非阻塞I/O
3. 单线程避免了线程切换和竞态产生的消耗

## 字符串

值：

1. 字符串： 简单字符串，复杂字符串（JSON，XML）
2. 数字：整数、浮点数
3. 二进制：图片。音频，视频，最大不能超过512MB

```js
set key value # 设置键值对
setex key seconds value # 设置键值对并设置过期时间
setpx key milliseconds value # 设置键值对并设置过期时间，单位为毫秒
setnx key value # 只有在键不存在时才设置键值对
setxx key value # 只有在键存在时才设置键值对
mset key1 value1 key2 value2 key3 value3 # 批量设置键值对

get key # 获取键对应的值
mget key1 key2 key3 # 批量获取键对应的值

incr key # 键对应的值加1
incrby key increment # 键对应的值加上指定的增量
incrbyfloat key increment # 键对应的值加上指定的浮点数增量
decr key # 键对应的值减1
decrby key decrement # 键对应的值减去指定的减量
decrbyfloat key decrement # 键对应的值减去指定的浮点数减量

append key value # 键对应的值后面追加字符串
strlen key # 键对应的值的长度
getset key value # 先获取键对应的值，再设置键对应的值
setrange key offset value # 从指定偏移量开始，用新字符串替换键对应的值的子字符串
getrange key start end # 获取键对应的值的子字符串，范围为[start, end]

```
### 内部编码

1. int ： 8个字节的长整型
2. embstr ： <= 39个字节的字符串
3. raw ： > 39个字节的字符串

### 典型使用场景

1. 缓存： 缓存频繁访问的数据，减少数据库压力
2. 计数器： 统计网站访问量、用户注册数等
3. 会话存储： 存储用户会话信息，实现无状态登录
4. 限速： 控制对某些资源的访问频率，防止滥用

## 哈希

1. field-value ： 键值对

```js
hset key field value # 设置哈希字段的值
hget key field # 获取哈希字段的值
hmset key field1 value1 field2 value2 # 批量设置哈希字段的值
hmget key field1 field2 # 批量获取哈希字段的值
hincrby key field increment # 哈希字段的值加上指定的增量
hincrbyfloat key field increment # 哈希字段的值加上指定的浮点数增量
hdecrby key field decrement # 哈希字段的值减去指定的减量
hdecrbyfloat key field decrement # 哈希字段的值减去指定的浮点数减量
hkeys key # 获取哈希所有字段
hvals key # 获取哈希所有值
hlen key # 获取哈希字段数量
hexists key field # 检查哈希字段是否存在
hdel key field1 field2 # 删除哈希字段
hgetall key # 获取哈希所有字段和值
hscan key cursor [MATCH pattern] [COUNT count] # 迭代哈希字段和值
hstrlen key field # 获取哈希字段值的字符串长度

object encoding key # 获取键的内部编码
```
### 内部编码

    1. ziplist ： 压缩列表
    2. hashtable ： 哈希表

### 使用场景

1. 会话存储： 存储用户会话信息，实现无状态登录
2. 点赞收藏： 存储用户点赞和收藏的文章、商品等，方便进行统计分析
3. 标签系统： 存储文章、用户、商品等的标签，方便进行分类和搜索

## 列表

最多可以存储2^32-1个元素
```js
lpush key value1 value2 value3 # 从列表头插入元素
rpush key value1 value2 value3 # 从列表尾插入元素
lpop key # 从列表头弹出元素
rpop key # 从列表尾弹出元素
lrange key start end # 获取列表指定范围的元素，范围为[start, end]
llen key # 获取列表长度
lindex key index # 获取列表指定索引的元素
lset key index value # 设置列表指定索引的元素
lrem key count value # 删除列表中指定数量的元素
ltrim key start end # 修剪列表，保留指定范围的元素，范围为[start, end]
linsert key before|after pivot value # 在列表中指定元素前或后插入新元素
blpop key1 key2 timeout # 从多个列表头弹出元素，阻塞直到有元素弹出或超时
brpop key1 key2 timeout # 从多个列表尾弹出元素，阻塞直到有元素弹出或超时
```
### 内部编码

1. linkedlist ： 链表
2. ziplist ： 压缩列表
3. quicklist ： 快速列表

### 使用场景

1. 消息队列
    1. 队列： 先进先出（FIFO）
    2. 栈： 先进后出（LIFO）
2. 文章列表
    1. 文章列表： 存储文章的有序集合，根据发布时间排序
    2. 文章详情： 存储文章的详细信息，包括标题、内容、作者、发布时间等

```js
lpush+lpop = Stack(栈)
rpush+rpop = Queue(队列)
lpush+ltrim=Capped Collection(有上限的集合)
lpush+brpop=Message Queue(消息队列)
```

## 集合

set 保存多个的字符串元素，每个元素都是唯一的，无序的，最多可以存储2^32-1个元素
```js
sadd key member1 member2 member3 # 向集合添加元素
smembers key # 获取集合所有元素
sismember key member # 检查元素是否在集合中
srem key member1 member2 # 从集合中删除元素
scard key # 获取集合元素数量
sinter key1 key2 # 求多个集合的交集
sunion key1 key2 # 求多个集合的并集
sdiff key1 key2 # 求多个集合的差集
srandmember key [count] # 随机获取集合中的元素，count 为获取数量，不指定则返回一个元素
spop key [count] # 随机弹出集合中的元素，count 为弹出数量，不指定则弹出一个元素
sinterstore destination key1 key2 # 求多个集合的交集，并将结果存储到新集合中
sunionstore destination key1 key2 # 求多个集合的并集，并将结果存储到新集合中
sdiffstore destination key1 key2 # 求多个集合的差集，并将结果存储到新集合中
```
### 内部编码

1. intset ： 整数集合
2. hashtable ： 哈希表

### 使用场景

1. 标签系统： 存储文章、用户、商品等的标签，方便进行分类和搜索
2. 好友关系： 存储用户之间的好友关系，方便进行好友推荐
3. 点赞收藏： 存储用户点赞和收藏的文章、商品等，方便进行统计分析

## 有序集合

不能有重复的元素，可排序，每个元素都有一个分数（score），根据分数进行排序

```js
zadd key score1 member1 score2 member2 # 向有序集合添加元素
zrange key start end [WITHSCORES] # 获取有序集合指定范围的元素，范围为[start, end]，WITHSCORES 表示同时返回元素的分数
zrevrange key start end [WITHSCORES] # 获取有序集合指定范围的元素，范围为[start, end]，WITHSCORES 表示同时返回元素的分数，按分数从高到低排序
zscore key member # 获取有序集合中指定元素的分数
zrem key member1 member2 # 从有序集合中删除元素
zcard key # 获取有序集合元素数量
zcount key min max # 获取有序集合中分数在指定范围内的元素数量
zrank key member # 获取有序集合中指定元素的排名，按分数从低到高排序
zrevrank key member # 获取有序集合中指定元素的排名，按分数从高到低排序
zincrby key increment member # 有序集合中指定元素的分数加上指定的增量
zrangebyscore key min max [WITHSCORES] [LIMIT offset count] # 获取有序集合中分数在指定范围内的元素，范围为[min, max]，WITHSCORES 表示同时返回元素的分数，LIMIT 表示限制返回结果的数量和偏移量
zremrangebyscore key min max # 从有序集合中删除分数在指定范围内的元素，范围为[min, max]
zunionstore destination key1 key2 # 求多个有序集合的并集，并将结果存储到新有序集合中
zinterstore destination key1 key2 # 求多个有序集合的交集，并将结果存储到新有序集合中

zinterstore destination key1 key2 weights weight1 weight2 aggregate sum|min|max # 求多个有序集合的交集，并将结果存储到新有序集合中，weights 表示每个有序集合的权重，aggregate 表示聚合方式，sum 表示按分数求和，min 表示按分数取最小值，max 表示按分数取最大值

-inf 和 +inf 表示负无穷大和正无穷大，分别用于表示有序集合的最小和最大分数
zrangebyscore key -inf +inf # 获取有序集合所有元素，按分数从低到高排序
zrevrangebyscore key +inf -inf # 获取有序集合所有元素，按分数从高到低排序

zrevrangebyscore key (250 +inf withscores # 获取有序集合中分数大于250的元素，按分数从高到低排序，同时返回元素的分数
```
### 内部编码

1. ziplist ： 压缩列表
2. skiplist ： 跳跃列表

### 使用场景

1. 排行榜系统： 存储用户得分，根据得分排序展示排行榜
2. 时间轴： 存储事件，根据时间排序展示时间轴
3. 商品排序： 存储商品，根据价格、销量等排序展示商品列表

列出列表、集合、有序集合的异同点

![异同点](/diff.png)

```js
rename oldkey newkey # 重命名键
get newkey # 获取新键对应的值
renamenx oldkey newkey # 只有在新键不存在时才重命名键
randomkey # 随机返回一个键
dbsize # 返回数据库中键的数量
ttl key # 查看键的过期时间，单位为秒
expire key seconds # 设置键的过期时间，单位为秒
pttl key # 查看键的过期时间，单位为毫秒
expireat key timestamp # 设置键的过期时间，单位为秒，timestamp 为时间戳
pexpire key milliseconds # 设置键的过期时间，单位为毫秒
pexpireat key milliseconds-timestamp # 设置键的过期时间，单位为毫秒，milliseconds-timestamp 为时间戳
persist key # 移除键的过期时间，将键设置为永久有效
removeExpire key # 移除键的过期时间，将键设置为永久有效

move key db # 将键移动到指定数据库，db 为数据库编号
dump key # 序列化键对应的值，返回序列化后的字符串
restore key ttl serialized-value # 反序列化字符串，将其设置为键对应的值，ttl 为过期时间，serialized-value 为序列化后的字符串

# 源Redis执行dump:
set hello world
dump hello # 输出：\x00\x05hello\x00\x05world

# 目标Redis指定restore
get hello
restore hello 0 "\x00\x05hello\x00\x05world"

get hello # 输出：world

migrate host port key destination-db timeout copy replace key... # 将键从当前Redis迁移到指定Redis，host 为目标Redis主机，port 为目标Redis端口，key 为要迁移的键，destination-db 为目标Redis数据库编号，timeout 为迁移超时时间，单位为毫秒，copy 表示是否在迁移过程中复制键对应的值，而不是移动，replace 表示如果目标Redis中已存在相同键，则替换它

migrate 127.0.0.1 6380 hello 0 10000 copy replace

keys * # 查看所有键
keys [1, 3] # 查看索引为1和3的键
keys [1-3] # 查看索引为1到3的键
keys [j,r]edis # 查看所有以j或r开头的键
keys hill*  # 查看所有以hill开头的键

scan cursor [MATCH pattern] [COUNT count] # 迭代数据库中的键
```
### 数据库管理

```js
select dbIndex # 切换数据库，dbIndex 为数据库编号
# 默认进来是0号数据库，默认的一共16个数据库
flushdb # 清空当前数据库
flushall # 清空所有数据库

```

## 小功能大用处

### 慢查询分析

    1. 执行顺序
        - 发送命令
        - 命令排队
        - 命令执行 ：只统计这个时间
        - 命令返回
    2. 慢查询分析配置
        - slowlog-log-slower-than ： 慢查询阈值，单位为微秒，默认值为10000微秒，即10毫秒
        - slowlog-max-len ： 慢查询日志最大长度，默认值为128，即最多存储128条慢查询日志
        - slowlog-get-len ： 获取慢查询日志长度
```js
config get slowlog-log-slower-than # 获取慢查询阈值
config set slowlog-log-slower-than 10000 # 设置慢查询阈值为10毫秒
config get slowlog-max-len # 获取慢查询日志最大长度
config set slowlog-max-len 128 # 设置慢查询日志最大长度为128条
config get slowlog-get-len # 获取慢查询日志长度
config set slowlog-get-len 10 # 设置慢查询日志长度为10条
config rewrite # 重新加载配置文件，使新的配置生效

slowlog get 10 # 获取最近10条慢查询日志
slowlog len # 获取慢查询日志长度
slowlog reset # 清空慢查询日志

```
最佳实践

1. slowlog-max-len: # 线上建议调大慢查询列表，记录慢查询时Redis会对长命令进行截断，只记录截断后的命令
2. slowlog-log-slower-than: # 默认超过10毫秒判定为慢查询，高OPS场景建议设置为1毫秒
3. 只记录命令执行时间，不记录命令排队时间和网络传输时间。
4. 先进先出的队列，如果慢查询比较多的情况下，会丢失部分慢查询命令，定期执行slow get命令将日志持久化到其他存储中

### Redis Shell

#### redis-cli
了解全部参数，可以执行redis-cli-help查看
```js
-r count # 重复执行命令，count 为重复次数
redis-cli -r 3 ping # 发送3个ping命令

-i interval # 间隔时间，单位为秒，默认值为0.1秒
redis-cli -i 1 -r 3 ping # 发送3个ping命令，每个命令间隔1秒

-x # 执行命令后退出
echo 'world' | redis-cli -x set hello # 从标准输入读取数据，将其设置为键hello对应的值
redis-cli get hello # 输出：world

-c # 连接到指定的Redis实例，默认连接到127.0.0.1:6379
redis-cli -c -h 127.0.0.1 -p 6379

-a password # 连接到需要密码认证的Redis实例，password 为密码
redis-cli -a 123456 -h 127.0.0.1 -p 6379

--scan和--pattern # 扫描数据库中的键，--pattern 为匹配模式，默认值为*，即匹配所有键
redis-cli --scan --pattern hello* # 扫描所有以hello开头的键

--slave # 连接到从节点，默认连接到主节点
redis-cli --slave -h 127.0.0.1 -p 6380

--rdb # 连接到RDB文件，默认连接到dump.rdb
redis-cli --rdb dump.rdb # 连接到RDB文件dump.rdb

--pipe # 连接到Redis实例，默认连接到127.0.0.1:6379
redis-cli --pipe # 连接到Redis实例，默认连接到127.0.0.1:6379

--bigkeys # 扫描数据库中的键，统计键的大小和类型
redis-cli --bigkeys # 扫描数据库中的键，统计键的大小和类型

--eval script.lua key1 key2 arg1 arg2 # 执行Lua脚本，script.lua 为Lua脚本文件，key1 key2 为键，arg1 arg2 为参数

--latency # 开启延迟分析模式，用于分析命令执行时间
redis-cli --latency # 开启延迟分析模式，用于分析命令执行时间

--latency-history # 显示延迟分析历史记录
redis-cli --latency-history # 显示延迟分析历史记录

--latency-dist # 显示延迟分析分布直方图
redis-cli --latency-dist # 显示延迟分析分布直方图

--stat # 显示统计信息，包括连接数、命令数、内存使用情况等
redis-cli --stat # 显示统计信息，包括连接数、命令数、内存使用情况等

--raw # 以原始格式输出命令返回值，不进行任何转换
redis-cli --raw get hello # 输出：world

--no-raw # 禁用原始格式输出，默认值为false,返回的是二进制格式
redis-cli --no-raw get hello # 输出：world

```
#### redis-server详解
--test-memory # 测试内存使用情况
redis-server --test-memory # 测试内存使用情况

#### redis-benchmark
```js
-c clients # 并发客户端数量，默认值为50
redis-benchmark -c 100 -n 100000 # 模拟100个并发客户端，每个客户端执行100000个命令

-n requests # 每个客户端执行的请求数量，默认值为100000
redis-benchmark -c 100 -n 100000 # 模拟100个并发客户端，每个客户端执行100000个命令

-q #  quiet # 安静模式，只输出结果，不输出其他信息,仅仅显示redis-benchmark的requests per second的信息
redis-benchmark -c 100 -n 100000 -q # 模拟100个并发客户端，每个客户端执行100000个命令，只输出结果，不输出其他信息

-r size # 随机值大小 random
redis-benchmark -c 100 -n 100000 -r 100 # -r 在key，counter键上加一个12位的后缀， -r 100 表示只对后两位随机处理，

-P pipeline-size # 管道大小，默认值为1，即不使用管道 (pipeline)选项
redis-benchmark -c 100 -n 100000 -P 100 # 模拟100个并发客户端，每个客户端执行100000个命令，每个命令使用100个元素组成的管道

-k keepalive # 保持连接，默认值为0，即不保持连接
redis-benchmark -c 100 -n 100000 -k 1 # 模拟100个并发客户端，每个客户端执行100000个命令，保持连接

-t commands # 测试的命令列表
redis-benchmark -t get,set -q # 模拟100个并发客户端，每个客户端执行100000个命令，超时时间为10秒

--csv # 输出结果为CSV格式
redis-benchmark -c 100 -n 100000 -q --csv # 模拟100个并发客户端，每个客户端执行100000个命令，只输出结果，不输出其他信息，输出结果为CSV格式

```

### Pipeline

RTT ： Round Trip Time，即往返时间，指的是客户端发送命令到服务器接收响应的时间，包括网络传输时间和服务器处理时间。
原生批量命令是原子的，Pipeline是非原子的
原生批量命令是一个命令对应多个key,Pipeline支持多个命令
原生批量命令是Redis服务端支持实现的，Pipeline需要服务端和客户端的共同实现

### 事务与Lua
事务： 多个命令作为一个整体执行，要么全部成功，要么全部失败
multi # 开始一个事务
exec # 执行事务中的所有命令
discard # 取消事务

**Lua**
数据类型：booleans numbers, strings, tables
```js
local strings val = "world" # local 代表val是一个局部变量，没有代表全局变量
local tables myArray = {"hello", "world"} # 数组
# 计算1到100的和
local int sum = 0
for i = 1, 100
do
    sum = sum + i
end

print(sum) # 输出：5050

# 遍历myArray
for i = 1, #myArray
do
    print(myArray[i])
end

# 内置函数ipairs 遍历出所有的索引下标和值：
for index,value in ipairs(myArray)
do
    print(index,value)
end

# while
local int sum = 0
local int i = 0
while i < 100
do
    sum = sum + i
    i = i + 1
end

print(sum) # 输出：5050

# if else
local tables myArray = {"redis", "mysql", "postgresql", 'jedis'}
for i =1, #myArray
do
    if myArray[i] == "jedis"
    then
        print('true')
        break
    else
        print('false')
    end
end

# 哈希
local tables myHash = {name="redis", version="6.0.10"}
print(myHash.name) # 输出：redis
print(myHash.version) # 输出：6.0.10

for key,value in pairs(myHash)
do
    print(key .. value)
end

# 函数
function funcName()
    ...
end

function contact (str1, str2)
    return str1 .. str2
end

print(contact("hello", "world")) # 输出：helloworld

eval 'return "hello " .. KEYS[1] .. ARGV[1]' 1 redis world # 输出：hello redis world

evalsha sha1 1 redis world # 输出：hello redis world # sha1 为eval命令返回的脚本哈希值
script load 命令可以将脚本内容加载到Redis内存中，
redis-cli script load "$(cat lua_get.lua)" # "1231231sdfa1edfa"
evalsha 1231231sdfa1edfa 1 redis world # 输出：hello redis world

```

### Bitmaps
### HyperLogLog
### 发布订阅
### CEO 
