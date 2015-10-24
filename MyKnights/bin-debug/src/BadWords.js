var TrieNode = (function () {
    function TrieNode() {
        this.m_values = {};
        this.is_end = false;
    }
    var __egretProto__ = TrieNode.prototype;
    __egretProto__.AddKey = function (word) {
        var length = word.length;
        if (length <= 0) {
            return;
        }
        var pNode = this;
        for (var i = 0; i < length; i++) {
            var k = word[i];
            var pSubNode = null;
            if (pNode.m_values[k] == null) {
                //console.log("new sub node " + k);
                pSubNode = new TrieNode();
                pNode.m_values[k] = pSubNode;
            }
            else {
                //console.log("founded " + k);
                pSubNode = pNode.m_values[k];
            }
            pNode = pSubNode;
        }
        if (pNode != this) {
            pNode.is_end = true;
        }
    };
    return TrieNode;
})();
TrieNode.prototype.__class__ = "TrieNode";
var BadWords = (function () {
    function BadWords() {
    }
    var __egretProto__ = BadWords.prototype;
    BadWords.initBadWordsList = function () {
        if (BadWords.g_TrieNode != null) {
            return;
        }
        BadWords.g_TrieNode = new TrieNode();
        var bad_words_len = BadWords.BAD_WORDS.length;
        for (var i = 0; i < bad_words_len; i++) {
            BadWords.g_TrieNode.AddKey(BadWords.BAD_WORDS[i]);
        }
    };
    BadWords.BadwordFilter = function (source) {
        BadWords.initBadWordsList();
        var length = source.length;
        var any_modify = false;
        var char_list = [];
        for (var index = 0; index < length; index++) {
            char_list.push(source[index]);
        }
        var i = 0;
        var len_greddy = 0;
        while (i < length) {
            var current_char = source[i];
            if (BadWords.g_TrieNode.m_values[current_char] == null) {
                //console.log("skip: " + i);
                i++;
                continue;
            }
            // BadWords.g_TrieNode.m_values[current_char] != null
            var node = BadWords.g_TrieNode.m_values[current_char];
            if (node.is_end == true) {
                len_greddy = 1;
            }
            for (var j = i + 1; j < length; j++) {
                current_char = source[j];
                node = node.m_values[current_char];
                if (node != null) {
                    if (node.is_end == true) {
                        len_greddy = j - i + 1;
                    }
                }
                else {
                    break;
                }
            }
            for (var k = i; k < i + len_greddy; k++) {
                //console.log("=========== " + char_list[k]);
                char_list[k] = '*';
                any_modify = true;
            }
            if (len_greddy > 0) {
                i += len_greddy;
            }
            else {
                i++;
            }
            len_greddy = 0;
        }
        if (any_modify) {
            var str_modified = "";
            for (var index = 0; index < length; index++) {
                str_modified += char_list[index];
            }
            return str_modified;
        }
        return source;
    };
    BadWords.HasAnyBadword = function (source) {
        BadWords.initBadWordsList();
        var length = source.length;
        var i = 0;
        var len_greddy = 0;
        while (i < length) {
            var current_char = source[i];
            if (BadWords.g_TrieNode.m_values[current_char] == null) {
                //console.log("skip: " + i);
                i++;
                continue;
            }
            // BadWords.g_TrieNode.m_values[current_char] != null
            var node = BadWords.g_TrieNode.m_values[current_char];
            if (node.is_end == true) {
                len_greddy = 1;
            }
            for (var j = i + 1; j < length; j++) {
                current_char = source[j];
                node = node.m_values[current_char];
                if (node != null) {
                    if (node.is_end == true) {
                        len_greddy = j - i + 1;
                    }
                }
                else {
                    break;
                }
            }
            // Replace bad words
            if (len_greddy > 0) {
                return true;
            }
            else {
                i++;
            }
            len_greddy = 0;
        }
        return false;
    };
    BadWords.BAD_WORDS = ["﻿ＳＢ", "ＦＵＣＫ", "ＦＡＬＵＮ", "ｆａｌｕｎ", "sars", "bitch", "falun", "FALUN", "flg", "FLG", "fuck", "FUCK", "md", "MD", "liusi", "LIUSI", "nake", "NAKE", "nnd", "NND", "sb", "SB", "shit", "SHIT", "sex", "SEX", "tmd", "TMD", "16大", "3K党", "K药", "肏", "赑", "一夜情", "丁一平", "万学远", "万税", "三K", "三个代", "三级片", "上访", "东条英机", "中共", "中关村大厦", "中华人民共和国", "中国政府", "中央", "主席", "乔传秀", "乔宗淮", "乔石", "书记", "仁青加", "令计划", "任泽民", "何光", "何勇", "佘靖", "俞正声", "信仰危机", "倪益瑾", "做爱", "傅克诚", "傅志寰", "储波", "傻B", "傻比", "傻逼", "傻鄙", "克林顿", "党卫军", "全哲洙", "八九风波", "公告", "公投", "六四", "共产党", "共党", "共匪", "关东军", "军国主义", "冤假错案", "冯健身", "冯永生", "冲锋队", "刘玠", "刘丰富", "刘云山", "刘云山", "刘云耕", "刘华秋", "刘华秋", "刘奇葆", "刘家义", "刘峰岩", "刘德旺", "刘志峰", "刘明康", "刘晓江", "刘江", "刘泽民", "刘淇", "刘玉浦", "刘石泉", "刘积斌", "刘立清", "刘粤军", "刘锡荣", "刘鹏", "十六大", "单霁翔", "卖淫", "南云", "南振中", "博讯", "卫留成", "卵子", "口交", "台独", "台湾", "史莲喜", "叶小文", "司马义•铁力瓦尔地", "吉炳轩", "向巴平措", "吕祖善", "吕秀莲", "吴仪", "吴启迪", "吴基传", "吴官正", "吴定富", "吴广才", "吴新雄", "吴毓萍", "吴爱英", "吴玉良", "吴玉谦", "吴邦国", "吴铨叙", "吴邦国", "乌云其木格", "周同战", "周声涛", "周小川", "周强", "周恩来", "周永康", "周生贤", "周遇奇", "唐天标", "唐家璇", "回良玉", "国共", "国民党", "圆满", "圣战", "基地组织", "夏宝龙", "夏赞忠", "多吉才让", "多维", "大世纪", "大东亚", "大便", "大纪元", "天安门", "太子党", "套子", "奚国华", "奸", "妈", "妓", "妣", "委员", "姜大明", "姜建清", "姜异康", "姜福堂", "娼", "婊", "子宫", "孙宝树", "孙家正", "孙忠同", "孙文盛", "孙春兰", "孙淑义", "孙淦", "孙英", "孙载夫", "孟学农", "孟建柱", "季允石", "安立敏", "宋爱荣", "宋祖英", "宋秀岩", "小便", "小平", "小弟弟", "小鸡鸡", "尚福林", "尹凤岐", "尻", "局长", "屁", "山本", "岳喜翠", "岳宣义", "岳福洪", "崔会烈", "川岛芳子", "巴特尔", "市长", "布什", "布穷", "希特勒", "常万全", "常委", "常小兵", "干以胜", "床上戏", "康日新", "廖晖", "廖锡龙", "张中伟", "张云川", "张俊九", "张凤楼", "张华祝", "张孝忠", "张学忠", "张定发", "张宝顺", "张左己", "张平", "张庆伟", "张庆黎", "张德江", "张德邻", "张恩照", "张惠新", "张文台", "张文岳", "张文康", "张春贤", "张树田", "张毅", "张玉台", "张福森", "张立昌", "张维庆", "张行湘", "张轩", "张钰钟", "张高丽", "张黎", "强力推出", "强卫", "强暴", "彭小枫", "彭祖意", "徐光春", "徐冠华", "徐匡迪", "徐守盛", "徐志坚", "徐才厚", "徐承栋", "徐敬业", "徐有芳", "徐荣凯", "性交", "性爱", "总理", "息中朝", "想上你", "慰安妇", "戆B", "戆卵", "戆比", "我太阳你", "我日", "戳B", "戳比", "戴相龙", "戴秉国", "打炮", "打飞机", "扼杀权利", "拉登", "挺起", "排泄", "推荐主机", "摇头丸", "操", "支树平", "支那", "政治", "散襄军", "文学城", "新疆独立", "曹伯纯", "曹刚川", "曹康泰", "曹建明", "曹洪兴", "曾培炎", "曾庆红", "替罪羊", "本拉登", "朱之鑫", "朱发忠", "朱镕基", "朱德", "朱成友", "朱文泉", "朱祖良", "朱维群", "杂碎", "杂种", "李东生", "李传卿", "李克", "李宏志", "李岚清", "李崇禧", "李德洙", "李志坚", "李成玉", "李文华", "李春城", "李景田", "李有慰", "李洪志", "李清林", "李源潮", "李玉赋", "李登辉", "李纪恒", "李继松", "李至伦", "李荣融", "李运之", "李金华", "李金明", "李铁映", "李长印", "李长春", "李长江", "李雪莹", "李鸿忠", "李鹏", "杜世成", "杜学芳", "杜宇新", "杜德印", "杜青林", "杨传堂", "杨元元", "杨光洪", "杨利民", "杨多良", "杨晶", "杨永良", "杨永茂", "杨洁篪", "林左鸣", "林文肯", "林明月", "林树森", "柴松岳", "栗战书", "桶钩子", "桶勾子", "梁保华", "梁光烈", "梁绮萍", "楼继伟", "樊守志", "欧广源", "欧泽高", "武士道", "武汉女大学生", "殷一璀", "毛泽东", "民运", "江泽民", "池宇峰", "汪光焘", "汪恕诚", "汪洋", "沈德咏", "沈淑济", "沈跃跃", "沙比", "法轮", "法轮功", "洪虎", "淫", "温宗仁", "温家宝", "温熙森", "游行", "滕久明", "滕文生", "潘云鹤", "灭族", "热地", "焦焕成", "煞笔", "熊光楷", "爷爷", "牟新生", "牺牲品", "狗娘", "狗日", "独立", "独裁", "猥亵", "猥琐", "王三运", "王乐泉", "王众孚", "王侠", "王兆国", "王八", "王刚", "王华元", "王同琢", "王君", "王唯众", "王家瑞", "王寿亭", "王岐山", "王建宙", "王德顺", "王志刚", "王忠禹", "王成铭", "王振川", "王明方", "王明权", "王显政", "王晨", "王景川", "王曙光", "王梦奎", "王正伟", "王正福", "王洛林", "王莉莉", "王谦", "王兆国", "田凤山", "田淑兰", "田聪明", "由喜贵", "疆独", "疫情", "疯狗", "瘪三", "白春礼", "白景富", "白玛", "白痴", "省长", "看中国报道", "睾丸", "瞒报", "石大华", "石宗源", "石广生", "石玉珍", "祝光耀", "祝春林", "秦光荣", "秦大河", "秦绍德", "竺延风", "符廷贵", "符桂花", "管国忠", "管理员", "红色旅", "纳粹", "罗世谦", "罗保铭", "罗干", "罗正富", "罗清泉", "署长", "翟小衡", "翟虎渠", "老江", "老表", "聂卫国", "聂成根", "聂振邦", "胡家燕", "胡彪", "胡永柱", "胡锦涛", "胡瘟", "腚", "自焚", "舒晓琴", "艾斯海提•克里木拜", "苏新添", "苏树林", "范新德", "范长龙", "萨达姆", "葛振峰", "董万才", "董宜胜", "董雷", "蒋文兰", "蒙进喜", "蒲海清", "蔡长松", "薄熙来", "薛利", "薛延忠", "藏独", "藏 独", "藏  独", "藏   独", "藏    独", "虞云耀", "袁伟民", "袁守芳", "袁纯清", "裴怀亮", "解厚铨", "解振华", "警察", "许志功", "许永跃", "请愿", "谢企华", "谢作炎", "谢旭人", "习近平", "贝戈戈", "贱", "贺国强", "贺邦靖", "贾庆林", "贾文先", "贾春旺", "贾治邦", "走向共和", "赵乐际", "赵可铭", "赵启正", "赵春兰", "赵洪祝", "赵紫阳", "赵荣", "路甬祥", "女干", "迟浩田", "迫害", "逄先知", "邓小平", "邓朴方", "邢元敏", "李鸿志", "李宏志", "邱学强", "邱衍汉", "郑万通", "郑坤生", "郑斯林", "郑立中", "郑筱萸", "部长", "郭东坡", "郭伯雄", "郭声琨", "郭庚茂", "郭树清", "郭金龙", "金人庆", "金道铭", "金银焕", "钮茂生", "钱其琛", "钱国梁", "钱树根", "钱运录", "铁凝", "锦涛", "闵维方", "闻世震", "阎海旺", "阳安江", "阴茎", "阴蒂", "阴道", "陆浩", "陈云林", "陈传阔", "陈元", "陈冀平", "陈培忠", "陈奎元", "陈希", "陈希明", "陈建国", "陈.+扁", "陈炳德", "陈福今", "陈章立", "陈绍基", "陈至立", "陈至立", "陈良宇", "陈训秋", "陈邦柱", "陶建幸", "陶方桂", "隋明太", "雷鸣球", "靖志远", "非典", "靠", "韦建桦", "韩忠信", "韩正", "韩长赋", "韩启德", "项怀诚", "马之庚", "马加爵", "马右加文", "马子龙", "马富才", "马志鹏", "马铁山", "骚逼", "高中兴", "高俊良", "高祀仁", "魏家福", "魏建国", "魏礼群", "鸡八", "鸡吧", "鸡巴", "黄丹华", "黄丽满", "黄兴国", "黄华华", "黄晴宜", "黄智权", "黄树贤", "黄洁夫", "黄淑和", "黄献中", "黄瑶", "黄菊", "黄远志", "黄选平", "黄镇东", "鼠疫", "龙新民", "龟头", "日本", "生殖", "阳具", "东条英机", "土肥原贤二", "木村兵太郎", "广田弘毅", "松井石根", "板垣征四郎", "武藤章", "小矶国昭", "松冈洋右", "东乡茂德", "白鸟敏夫", "梅津美治郎", "平沼骐一郎", "永野修身", "法 轮", "法!轮", "法#轮", "法$轮", "法＊＊轮", "法**轮**功", "法＊＊轮＊＊功", "法*功", "法*轮", "法＊轮", "法*轮*功", "法＊轮功", "法?轮", "法@轮", "法^轮", "法+轮", "法＋轮＋功", "法•轮•功", "法lun功", "法o轮o功", "法功", "法愣", "法抡", "法抡功", "法仑", "法伦", "法轮", "法-轮", "法轮大法", "法轮功", "法论", "法论大法", "法论功", "法十轮十功", "代练", "带练", "东土尔其斯坦", "东突", "私服", "私_服", "私*服", "私-服",];
    BadWords.g_TrieNode = null;
    return BadWords;
})();
BadWords.prototype.__class__ = "BadWords";
var BW = BadWords;