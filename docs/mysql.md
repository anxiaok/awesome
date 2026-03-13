##  第一章 了解SQL

1. 数据库(database) 保存有组织的数据的容器
2. 数据库软件应称为DBMS(数据库管理系统)
3. 表(table) 某种特定类型数据的结构化清单
4. 表由列(column)和行(row)两部分组成，每个列都有一个唯一的名称，每个行都有一个唯一的标识符
5. 主键， 一列或一组列，其值能够唯一区分表中的每个行，表中的任何列都可以作为主键
    - 主键必须是唯一的
    - 主键不能为空
6. 好习惯
    - 不更新主键列中的值
    - 不重用主键列的值
    - 不在主键列中使用可能会更改的值。
7. 外键， 一列或一组列，其值引用其他表中的主键
8. 什么是SQL？ SQL是一种专门用来与数据库通信的语言
    - 所有重要的DBMS都支持SQL
    - 简单易学
    - 灵活使用其语言元素，可以进行非常复杂和高级的数据库操作
    - 不要任务SQL语法是完全可移植的


## 第二章 mysql简介

1. 什么是MySQL? 他是一种DBMS
    - 成本 - 开放源代码，免费使用
    - 性能 - 置信很快
    - 可信赖
    - 简单
2. DBMS分为两种： 一类：基于共享文件系统的DBMS，另一类：基于客户机-服务器的DBMS（MySQL，Oracle, Microsoft SQL Server）

### mysql工具

1. mysql命令行实用程序
    - 命令输入在mysql> 之后
    - 命令用;或\g结束，换句话说，仅按Enter不执行命令
    - help 或\h获得帮助
    - quit 或exit 退出命令行实用程序
2. Mysql Administrator(MySQL 管理器) 是一个图形交互客户机
3. mySql Query Browser 是一个图形交互客户机

## 第三章 使用MySQL

1. 主机名： 本地服务器：localhost
2. 端口号： 默认3306
```sql
USE crashcourse; # 使用数据库
SHOW databases; # 显示所有数据库
SHOW tables; # 显示所有表
SHOW columns FROM customers; # 显示表中的所有列
DESCRIBE customers; # 显示表的详细信息, 是SHOW columns FROM customers的快捷方式
SHOW STATUS; # 显示广泛的服务器状态信息
SHOW CREATE DATABASE; # 显示创建特定数据库
SHOW CREATE TABLE; # 显示表的创建语句
SHOW GRANTS;# 显示用户权限
SHOW ERRORS; # 显示最近的错误
SHOW WARNINGS; # 显示最近的警告
```
## 第四章 检索数据

```sql
SELECT prod_name FROM products;
SELECT prod_id, prod_name FROM products;
SELECT * FROM products;
SELECT DISTINCT vend_id FROM products; # 显示所有供应商ID，不重复  DISTINCT关键字：唯一的
SELECT prod_name FROM products limit 5; # 显示前5条记录
SELECT prod_name FROM products limit 5 offset 5; # 从行5开始，取5行
SELECT prod_name FROM products LIMIT 5,5; # 第一个数为开始位置，第二数为检索的行数
SELECT products.prod_name FROM products;
SELECT products.prod_name FROM crashcourse.products;
```
## 第五章 排序检索数据

```sql
SELECT prod_name FROM products ORDER BY prod_name;
SELECT prod_name FROM products ORDER BY prod_name DESC; # 降序排序  默认是ASC 升序
SELECT prod_name FROM products ORDER BY prod_name, prod_price; # 多列排序
SELECT prod_price FROM products ORDER BY prod_price DESC limit 1;
```
## 第六章 过滤数据

```sql
SELECT prod_name FROM products WHERE prod_price >= 100; # 筛选出所有价格大于等于100的记录
SELECT prod_name FROM products WHERE prod_price >= 100 AND prod_price <= 200; # 筛选出所有价格在100到200之间的记录
SELECT prod_name FROM products WHERE prod_price >= 100 OR prod_price <= 200; # 筛选出所有价格大于等于100或小于等于200的记录
SELECT prod_name FROM products WHERE prod_price >= 100 ORDER BY prod_price DESC; # 同时使用where和order by, 先筛选，再排序
SELECT prod_name FROM products WHERE prod_price BETWEEN 100 AND 200; # 筛选出所有价格在100到200之间的记录
SELECT prod_name FROM products WHERE prod_price IS NULL; # 筛选出所有价格为空的记录
```
![操作符](/where字句操作符.png)

## 第七章 数据过滤

```sql
SELECT prod_name FROM products WHERE prod_price IN (100, 200, 300) ORDER BY prod_name; # 筛选出所有价格在100,200,300中的记录  
SELECT prod_name FROM products WHERE prod_price NOT IN (100, 200, 300) ORDER BY prod_name; # 筛选出所    有价格不在100,200,300中的记录

```
## 第八章 用通配符进行过滤

1. 通配符% 表示搜索模式中给定位置的0个，1个或多个字符，不能匹配到NULL值
2. 通配符_ 表示搜索模式中给定位置的单个字符，不能匹配到NULL值
3. 技巧
    - 不要过度使用通配符
    - 不要使用通配符%和_在字符串的开头或结尾
    - 不要使用通配符%和_在字符串的开头或结尾
```sql
SELECT prod_name FROM products WHERE prod_name LIKE '%ball%'; # 筛选出所有名称中包含ball的记录
SELECT prod_name FROM products WHERE prod_name LIKE '%ball%'; # 筛选出所有名称中包含ball的记录
SELECT prod_name FROM products WHERE prod_name LIKE '_ball%'; # 筛选出所有名称中第二个字符为ball的记录
```

## 第九章 用正则表达式进行过滤

1. 区分大小写：BINARY关键字
2. 不区分大小写：IGNORECASE关键字
3. `[123]`和`1｜2｜3` 表示1,2,3中的一个字符
4. `[^123]` 表示1,2,3以外的任意字符
5. `[1-9]` 表示1到9中的一个字符
6. `[a-zA-Z]` 表示a到z或A到Z中的一个字符
7. `\\` 表示反斜杠字符
8. `^` 表示字符串的开头
9. `$` 表示字符串的结尾
10. `\. \\- \\f \\n \\r \\t \\\  \\v` 表示点号、短横线、换页符、回车符、换行符、制表符、反斜杠字符、垂直制表符字符中的一个
11. `*` 表示0个或多个字符
12. `+` 表示1个或多个字符
13. `?` 表示0个或1个字符
14. `{n}` 表示n个字符
15. `{n,m}` 表示n到m个字符
16. `{n,}` 表示n个或多个字符
17. `{n,m}` 表示n到m个字符
18. `{n,m}?` 表示n到m个字符，可选

```sql
SELECT prod_name FROM products WHERE prod_name REGEXP 'ball'; # 筛选出所有名称中包含ball的记录
SELECT prod_name FROM products WHERE prod_name REGEXP IGNORECASE 'ball'; # 筛选出所有名称中包含ball的记录，不区分大小写
SELECT prod_name FROM products WHERE prod_name REGEXP BINARY 'ball'; # 筛选出所有名称中包含ball的记录，区分大小写
select prod_name from products where prod_name regexp '1000|2000'; # 筛选出所有名称中包含1000或2000的记录
select prod_name from products where prod_name regexp '^[a-zA-Z0-9]+$'; # 筛选出所有名称中只包含字母和数字的记录
select prod_name from products where prod_name regexp '[123] Ton'; # 筛选出所有名称中包含1,2,3中的一个的记录
select prod_name from products where prod_name regexp '\\([0-9] sticks?\\)'; # 筛选出所有名称中包含1,2,3中的一个，后跟一个数字的记录
select prod_name from products where prod_name regexp '[[:digit:]]{4}'; # 筛选出所有名称中包含4个数字的记录
```
### 匹配字符类

![字符类](/字符类.png)