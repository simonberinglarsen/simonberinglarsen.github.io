/*
Site Name: Sector 7 TFL Leaderboard
Theme URI: https://sector7hq.co
Author: Sector 7 HQ
Author URI: https://sector7hq.co/
Description: TFL Leaderboard by Sector 7
*/


console.clear();

let team = [];

const teamMale = [
  {rank:
1,
name:
 'Sanatan Pradhan',
time:
 '90 ',
reps:
 '185 ',
handle:
 'Self ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/116431303_212402770166323_7195326787198552077_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=pVs4-ioNqjwAX8HNb84&oh=b5bb4c4df65e53932fd2e1a1e2d16bc6&oe=5F6A99EE ',
  score1:
2,
  score2:
1},
{rank:
2,
name:
 'Pankaj Bartwal',
time:
 '99 ',
reps:
 '171 ',
handle:
 'Self ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/103956136_289396472428154_7379395720155597709_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=fTnw5Q6nq3QAX-11nq1&oh=61329edf1baced178ae098c9ac8f508e&oe=5F66BF76 ',
  score1:
5,
  score2:
6},
{rank:
3,
name:
 'Saurabh Mehta',
time:
 '111 ',
reps:
 '177 ',
handle:
 'Home gym ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/103541634_256093685623413_5823055367222835039_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=Sv8cuCXHgQoAX-s8Bbx&oh=7d2c360e0ee4cbbbe3e54b702a4c5224&oe=5F679AAB ',
  score1:
12,
  score2:
3},
{rank:
3,
name:
 'Vipin Chaudhary',
time:
 '84 ',
reps:
 '0 ',
handle:
 'The Fitness Garage ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/106918022_652471588690673_5078980746140006463_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=HD28WhFak5oAX8VCTU1&oh=b95ac226a9d0cd3a43aafb7e4194c504&oe=5F6BDA63 ',
  score1:
1,
  score2:
15},
{rank:
5,
name:
 'Bharat Khanna',
time:
 '90 ',
reps:
 '0 ',
handle:
 'Home gym ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/115910014_3097263320400110_3621204858754234392_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=7eybhttMXPMAX8TJG4P&oh=c00a699877e2d5163b68c74f197c9ca8&oe=5F673A5B ',
  score1:
2,
  score2:
15},
{rank:
7,
name:
 'Rahul Roy',
time:
 '112 ',
reps:
 '176 ',
handle:
 'Cure.fit ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/97267816_268107611007221_1145681598495064064_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=GfG7ybwgpnUAX8naCJY&oh=76fa5e972bb84879561035367a587534&oe=5F6C5BAA ',
  score1:
14,
  score2:
4},
{rank:
6,
name:
 'Sahil Singh',
time:
 '91 ',
reps:
 '0 ',
handle:
 'Ramdwara Vyayams ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/117894163_185924129608998_1561091951339611501_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=svnA67ah0CEAX9XSioY&oh=e1e9cd180f1c9732a154c971daa46fa8&oe=5F69452A ',
  score1:
3,
  score2:
15},
{rank:
7,
name:
 'Himanshu Makwana',
time:
 '93 ',
reps:
 '0 ',
handle:
 'Pro-fit ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/31270218_446428235791317_3893888045715292160_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=Hu7U1HPDBwgAX_QAT_u&oh=c9fdcf5ca293f78aa422326e78b659f6&oe=5F67DA38 ',
  score1:
4,
  score2:
15},
{rank:
9,
name:
 'Naveen Malhotra',
time:
 '107 ',
reps:
 '159 ',
handle:
 'Ilead fitness ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/118146733_172402384466833_5456058495943183627_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=z6tvCFiigSQAX-iSifj&oh=ee89e41110d25e0a2b18e3f021fcdcd1&oe=5F66AC00 ',
  score1:
10,
  score2:
10},
{rank:
9,
name:
 'Vivek Choudhary',
time:
 '100 ',
reps:
 '0 ',
handle:
 'Home ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/117190592_1684378435047127_8059474031742206001_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=zIS2HfV1kq8AX8CsVAe&oh=b4e613b96a7c177f7004c83ec376764e&oe=5F6AA20F ',
  score1:
6,
  score2:
15},
{rank:
11,
name:
 'Arjun Thapa',
time:
 '101 ',
reps:
 '0 ',
handle:
 'Home ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/95953748_570548213585314_7488911977549398016_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=WgL0aZ9mDWkAX_XVkeY&oh=782cfb3e4af89f2ec813c5923967028c&oe=5F6A1156 ',
  score1:
7,
  score2:
15},
{rank:
11,
name:
 'Purna Swargiary',
time:
 '101 ',
reps:
 '0 ',
handle:
 'Efficient Fitness Studio ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/52038646_1077399522451250_4811930824129642496_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=JipyrQCGiqkAX-rVBFS&oh=fdf4ec35cf16482e6d2d4b6ba31b7a2d&oe=5F67AAE9 ',
  score1:
7,
  score2:
15},
{rank:
13,
name:
 'Yash Sagar',
time:
 '102 ',
reps:
 '0 ',
handle:
 'Unbeatable fitness and mma ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/29092736_2046919978877536_4165605921881325568_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=iVlMKH7EGyAAX_vmf6P&oh=24491fd495530a564dbdb57ccbd37be0&oe=5F6A128D ',
  score1:
9,
  score2:
15},
{rank:
14,
name:
 'Bhuvnesh Nayak',
time:
 '109 ',
reps:
 '0 ',
handle:
 'Delhi Hapkido Association ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/117734529_184928566583194_5388799080135180563_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=o0xyZfqCUuMAX8R1uCW&oh=2ef537b35cd3646675b2522aef47688a&oe=5F66AFB8 ',
  score1:
11,
  score2:
15},
{rank:
15,
name:
 'Venkata Avinash Samsani',
time:
 '111 ',
reps:
 '0 ',
handle:
 'Self ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/94138973_220166259412043_2569953978607468544_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=19nbXYeEDmIAX8ARII7&oh=dd0021bc3bbba471e836f9b7893bc61e&oe=5F67255B ',
  score1:
12,
  score2:
15},
{rank:
16,
name:
 'Naushad Pirani',
time:
 '127 ',
reps:
 '172 ',
handle:
 'Fit 7 by MS Dhoni ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/117653866_302546797678209_7028048717995238973_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=U7ZuTE9zPRgAX_sYRVj&oh=adfbcbf3747df5ed1d856ced0301a034&oe=5F644032 ',
  score1:
23,
  score2:
5},
{rank:
17,
name:
 'Amit Kumar Das',
time:
 '112 ',
reps:
 '0 ',
handle:
 'Self ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/106238889_585617355692082_5951795999651341142_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=K2Egp1OlTMMAX9VdvXa&oh=9f4ee3a4baad3b41cd6d2b38e2491ea9&oe=5F656EEC ',
  score1:
14,
  score2:
15},
{rank:
18,
name:
 'Kashif Raza',
time:
 '115 ',
reps:
 '0 ',
handle:
 'Fit you ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/115993681_1512308588975898_5186424363090496364_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=za3SYLZkkt4AX_beeK8&oh=9a1b905b838a1fc2871805839be14fd7&oe=5F6920B1 ',
  score1:
16,
  score2:
15},
{rank:
19,
name:
 'Ishu Gurjar',
time:
 '117 ',
reps:
 '0 ',
handle:
 'Hype gym ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/50959421_2348324028787548_8586157636414603264_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=jOpntR6W-5oAX_0V5wY&oh=32d466034d8fb71549baa0a76b2705a0&oe=5F663A3F ',
  score1:
17,
  score2:
15},
{rank:
20,
name:
 'Akhil ._',
time:
 '118 ',
reps:
 '0 ',
handle:
 'Home Workout ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/116963986_755385855299858_9023349557077277646_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=S5zMrXwkRrcAX9alg7E&oh=8b1a39036065e1d03219c70acc6621d1&oe=5F653600 ',
  score1:
18,
  score2:
15},
{rank:
20,
name:
 'Devson Laikangbam',
time:
 '118 ',
reps:
 '0 ',
handle:
 'Home gym ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/69223982_520206218753976_932402907079245824_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=L2ttXY165TQAX_6Yq0W&oh=52f6cbdc47f14078f35aa2447d612b7f&oe=5F6636D5 ',
  score1:
18,
  score2:
15},
{rank:
22,
name:
 'Sagar Thapa',
time:
 '124 ',
reps:
 '0 ',
handle:
 'Mutantmmadehradun ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/102264835_2728475434105747_1562089075958087680_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=xREjueJrAacAX_eFzyr&oh=f1ed6d2118ae33d5a9a13ae973e1929a&oe=5F6EF667 ',
  score1:
20,
  score2:
15},
{rank:
23,
name:
 'Sudhanshu Singh',
time:
 '125 ',
reps:
 '0 ',
handle:
 'No ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/107321306_3094603863908342_7451647820988987776_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=GVSvQsUo0z8AX9QBBix&oh=6e41462e8ecf71756eb2074c8004db50&oe=5F6BF5DD ',
  score1:
21,
  score2:
15},
{rank:
23,
name:
 'Sidharth Waghmare',
time:
 '125 ',
reps:
 '0 ',
handle:
 'COEP ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/101688889_269377697453811_6263955749375001629_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=iqngGGbES5wAX9slOYy&oh=3fd974fe32157be2b89b9f2f2246e9bf&oe=5F6C2208 ',
  score1:
21,
  score2:
15},
{rank:
25,
name:
 'Yash  Nikam',
time:
 '132 ',
reps:
 '0 ',
handle:
 'ultra instinct fitness chamber ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/92550802_848338722338147_5162751436563415040_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=82S2q-AVwwcAX9KUXkQ&oh=13c73d5003e1abfaed59c0d2501c1b22&oe=5F6E7512 ',
  score1:
24,
  score2:
15},
{rank:
26,
name:
 'Ketan Bhutani',
time:
 '138 ',
reps:
 '0 ',
handle:
 'Cult ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/50959421_2348324028787548_8586157636414603264_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=0shYMrp_p8AAX-k1qF_&oh=56d2fc4c6e323b100a315bc119338971&oe=5F6A2EBF ',
  score1:
25,
  score2:
15},
{rank:
27,
name:
 'Himanshu Kathuria',
time:
 '141 ',
reps:
 '0 ',
handle:
 'Cult fit ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/117993584_3058332917599164_726202044559341263_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=PD0_qvoLmhUAX9vmn2i&oh=653988abd4023d27cbee9a21c2fe880f&oe=5F68C146 ',
  score1:
26,
  score2:
15},
{rank:
27,
name:
 'Sandeep Kumar',
time:
 '141 ',
reps:
 '0 ',
handle:
 'Home Gym ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/91293012_519685558740809_4116102008568545280_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=NvfGAT7ZJXEAX-xDIMH&oh=d57ca37ae610fb84d3f20041916e0d86&oe=5F66990F ',
  score1:
26,
  score2:
15},
{rank:
29,
name:
 'Bibek Gayary',
time:
 '142 ',
reps:
 '0 ',
handle:
 'Efficient Fitness Studio ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/106362049_200533141276500_7007997102946169154_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=Q3jxIGMhua4AX-8wjD8&oh=6e558d74f944103b52e79d0952dc640f&oe=5F6BC09F ',
  score1:
28,
  score2:
15},
{rank:
30,
name:
 'Aman Singh',
time:
 '141 ',
reps:
 '0 ',
handle:
 'Open gym ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/116422910_2352781538363105_6090947672425489015_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=QnLtPqG4RHUAX9pdXHo&oh=11a2cf02c8417fbdb1d32565f333731b&oe=5F66ED39 ',
  score1:
29,
  score2:
15},
{rank:
32,
name:
 'Rudra Singh',
time:
 '152 ',
reps:
 '161 ',
handle:
 'Open gym ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/117517546_294305185160561_2565147916829747581_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=VXnOdbk55HYAX8moUre&oh=4f55284338c630052df4c1798b1371cb&oe=5F65F109 ',
  score1:
37,
  score2:
8},
{rank:
32,
name:
 'Udit Sharma',
time:
 '144 ',
reps:
 '152 ',
handle:
 'Jsw recreation centre ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/117818638_772416990170923_6178637644836214194_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=bDpNztO09N4AX-8BE-7&oh=953c88fc6822fe16d6ba7b15305953f4&oe=5F6F20EE ',
  score1:
32,
  score2:
13},
{rank:
31,
name:
 'Vikramjeet Walia',
time:
 '143 ',
reps:
 '0 ',
handle:
 'Tegfit athlete ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/78776985_696649994074199_7693436795471527936_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=nuuCqGKEAUsAX9IDiha&oh=4d3ac55c805fcff1ee355fa0cf0c9127&oe=5F6439DF ',
  score1:
30,
  score2:
15},
{rank:
32,
name:
 'Sajan Biddappa',
time:
 '143 ',
reps:
 '0 ',
handle:
 'Limitless ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/46027595_737799339931049_3485292602662584320_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=IIt0HDwGmS4AX-tj6ME&oh=f15fc3ee96ddfbc44184ea799d4f7e16&oe=5F6AEE81 ',
  score1:
31,
  score2:
15},
{rank:
36,
name:
 'Karan Sonkhalla',
time:
 '0 ',
reps:
 '181 ',
handle:
 'Infinity ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/111914343_2682565328732483_8482031440305686235_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=P_M5AIDTq4IAX-1miNJ&oh=b510f7d042a3581c7b0b5aba45140b76&oe=5F6F5BBE ',
  score1:
46,
  score2:
2},
{rank:
36,
name:
 'Sanat Kumar',
time:
 '148 ',
reps:
 '148 ',
handle:
 'Cult ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/82005883_1403447453150467_3174671591334215680_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=jBUlfO-KuxgAX-mbabp&oh=7ad91d446d01ce1003fd4cf6fb74f149&oe=5F675C39 ',
  score1:
34,
  score2:
14},
{rank:
35,
name:
 'Ibad Ibad Khan',
time:
 '147 ',
reps:
 '0 ',
handle:
 'Home ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/13129815_622442291254973_1838027027_a.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=8ZO2TWdkjfMAX9gTx3k&oh=6c3d47aa68b21809b4d295402df7aa40&oe=5F6D1705 ',
  score1:
33,
  score2:
15},
{rank:
38,
name:
 'Kunal Jyoti Das',
time:
 '149 ',
reps:
 '0 ',
handle:
 'Fit factory gym ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/117169012_2683099518629478_7005494468121481291_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=2idu4Vd9hXkAX9lHpT_&oh=c89ab9429c55eea029165112a7a8d31a&oe=5F63ECC7 ',
  score1:
35,
  score2:
15},
{rank:
39,
name:
 'Junaid Qureshi',
time:
 '151 ',
reps:
 '0 ',
handle:
 'Self ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/71961537_2515224128716146_8912313604582146048_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=JrUsFjNvHUoAX_Pas-g&oh=c19d2ac02f6aae07a61246e6912914dd&oe=5F69B14A ',
  score1:
36,
  score2:
15},
{rank:
40,
name:
 'Ayan Das',
time:
 '166 ',
reps:
 '153 ',
handle:
 'Efficient fitness studio ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/102527414_674543490059309_669418919924072448_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=RJgyZa8rFhMAX_YFxG-&oh=7d1411406a3d06111b77045ca41d9504&oe=5F689300 ',
  score1:
40,
  score2:
12},
{rank:
43,
name:
 'Abhijeet Anand Singh',
time:
 '0 ',
reps:
 '168 ',
handle:
 'Home Workout ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/36160622_287094305200550_900397403494940672_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=GfVU_mUMdV0AX_kcoUH&oh=4da285376652b6e5caecc3d4a634c0ac&oe=5F6E83DD ',
  score1:
46,
  score2:
7},
{rank:
40,
name:
 'Abhishek Mane',
time:
 '155 ',
reps:
 '0 ',
handle:
 'Gym The Sandow ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/116133325_594270447901688_2570550402544152877_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=okCKlXCRkV8AX_YhI5S&oh=b1572db27d9fb95ee550e0666694c3e1&oe=5F6F522F ',
  score1:
38,
  score2:
15},
{rank:
40,
name:
 'Thutan Gombu',
time:
 '155 ',
reps:
 '0 ',
handle:
 'No gym ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/117964389_294332448519928_2494731782625623828_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=NgVBcYimSU4AX8hpriH&oh=4196faae85b403534111e51ca3484b48&oe=5F67FF45 ',
  score1:
38,
  score2:
15},
{rank:
44,
name:
 'Suraj Singh',
time:
 '0 ',
reps:
 '161 ',
handle:
 'Shree Dandeshwar Gym ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/106275375_1637878429708513_300388971509893760_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=NnvgIEU8X1cAX_vMU4i&oh=95b1936c0895fdb369c1bcf217535b0e&oe=5F6E7732 ',
  score1:
46,
  score2:
8},
{rank:
45,
name:
 'Pramod Notiyath',
time:
 '169 ',
reps:
 '0 ',
handle:
 'I Think Crossfit ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/54247446_444143483003969_5113642295169646592_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=YxN18hqiVVkAX_Jri5P&oh=143e08a55310c4ea49c4eb190cd169c7&oe=5F66794D ',
  score1:
41,
  score2:
15},
{rank:
47,
name:
 'Rajveer Singh Thakur',
time:
 '0 ',
reps:
 '155 ',
handle:
 'Total fitness gym ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/117596556_190557545819457_1785825421709137371_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=ptcv3Y8jcQgAX-ImIPs&oh=25e086a555f4a2d6e0c4512dc0e1b06f&oe=5F6CA7BE ',
  score1:
46,
  score2:
11},
{rank:
46,
name:
 'Uddipan Mitra',
time:
 '172 ',
reps:
 '0 ',
handle:
 'Cure.Fit ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/117306424_1189939648030913_6205921861378456469_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=UbF56U5XooYAX-yYsri&oh=25c3d76c6407a53efe8bb2b0606de023&oe=5F67B3BA ',
  score1:
42,
  score2:
15},
{rank:
47,
name:
 'Nirav Desai',
time:
 '175 ',
reps:
 '0 ',
handle:
 'Self ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/104107280_280576283304365_3427584624820244106_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=mBStKbtIkEYAX-mUdgg&oh=71eb88cff76c71bdfe40bea5ea650d42&oe=5F65048E ',
  score1:
43,
  score2:
15},
{rank:
49,
name:
 'Nilotpal Mahanta',
time:
 '30 ',
reps:
 '0 ',
handle:
 'No gym ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/117408313_110575100650824_5659286802939449153_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=6AOxRSvS4Q0AX-ljwrM&oh=533abd5995954849b2211f5ace488bb5&oe=5F6A4F43 ',
  score1:
44,
  score2:
15},
{rank:
50,
name:
 'Digvijay Thool',
time:
 '28 ',
reps:
 '0 ',
handle:
 'Home made Gym ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/110740559_889945398165107_8415692142732233611_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=r6kHABSvQZsAX_Bl7OJ&oh=d12154adc727550254cf01e7e51a4c3c&oe=5F691DAD ',
  score1:
45,
  score2:
15},
{rank:
51,
name:
 'Kushagra Singh',
time:
 '0 ',
reps:
 '0 ',
handle:
 'Ramdwara vayamshala ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/50959421_2348324028787548_8586157636414603264_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=0shYMrp_p8AAX-k1qF_&oh=56d2fc4c6e323b100a315bc119338971&oe=5F6A2EBF ',
  score1:
46,
  score2:
15},
{rank:
51,
name:
 'Arjun Ahlawat',
time:
 '0 ',
reps:
 '0 ',
handle:
 'Fit with box ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/50959421_2348324028787548_8586157636414603264_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=0shYMrp_p8AAX-k1qF_&oh=56d2fc4c6e323b100a315bc119338971&oe=5F6A2EBF ',
  score1:
46,
  score2:
15},
{rank:
51,
name:
 'Prateek Yadav',
time:
 '0 ',
reps:
 '0 ',
handle:
 'Gypsy fitness club ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/50959421_2348324028787548_8586157636414603264_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=0shYMrp_p8AAX-k1qF_&oh=56d2fc4c6e323b100a315bc119338971&oe=5F6A2EBF ',
  score1:
46,
  score2:
15},
{rank:
51,
name:
 'Aman Tripathi',
time:
 '0 ',
reps:
 '0 ',
handle:
 'AS44RaceFit ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/50959421_2348324028787548_8586157636414603264_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=0shYMrp_p8AAX-k1qF_&oh=56d2fc4c6e323b100a315bc119338971&oe=5F6A2EBF ',
  score1:
46,
  score2:
15},
{rank:
51,
name:
 'Karan Sonkhalla',
time:
 '0 ',
reps:
 '0 ',
handle:
 'Infinity ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/50959421_2348324028787548_8586157636414603264_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=0shYMrp_p8AAX-k1qF_&oh=56d2fc4c6e323b100a315bc119338971&oe=5F6A2EBF ',
  score1:
46,
  score2:
15},
{rank:
51,
name:
 'Abhay Sharma',
time:
 '0 ',
reps:
 '0 ',
handle:
 'Unit 6 Fitness ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/50959421_2348324028787548_8586157636414603264_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=0shYMrp_p8AAX-k1qF_&oh=56d2fc4c6e323b100a315bc119338971&oe=5F6A2EBF ',
  score1:
46,
  score2:
15},
{rank:
51,
name:
 'Swarnim Singh',
time:
 '0 ',
reps:
 '0 ',
handle:
 'No ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/50959421_2348324028787548_8586157636414603264_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=0shYMrp_p8AAX-k1qF_&oh=56d2fc4c6e323b100a315bc119338971&oe=5F6A2EBF ',
  score1:
46,
  score2:
15},
{rank:
51,
name:
 'Pulak Das',
time:
 '0 ',
reps:
 '0 ',
handle:
 'Cult fit ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/50959421_2348324028787548_8586157636414603264_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=0shYMrp_p8AAX-k1qF_&oh=56d2fc4c6e323b100a315bc119338971&oe=5F6A2EBF ',
  score1:
46,
  score2:
15},
{rank:
51,
name:
 'Prathamesh Nandivadekar',
time:
 '0 ',
reps:
 '0 ',
handle:
 'Home Gym ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/50959421_2348324028787548_8586157636414603264_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=0shYMrp_p8AAX-k1qF_&oh=56d2fc4c6e323b100a315bc119338971&oe=5F6A2EBF ',
  score1:
46,
  score2:
15},
{rank:
51,
name:
 'Shivendra Pandey',
time:
 '0 ',
reps:
 '0 ',
handle:
 'Transformers ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/50959421_2348324028787548_8586157636414603264_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=0shYMrp_p8AAX-k1qF_&oh=56d2fc4c6e323b100a315bc119338971&oe=5F6A2EBF ',
  score1:
46,
  score2:
15},
{rank:
51,
name:
 'Priyansh Jain',
time:
 '0 ',
reps:
 '0 ',
handle:
 'Home gym ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/50959421_2348324028787548_8586157636414603264_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=0shYMrp_p8AAX-k1qF_&oh=56d2fc4c6e323b100a315bc119338971&oe=5F6A2EBF ',
  score1:
46,
  score2:
15},
{rank:
51,
name:
 'Revan Thota',
time:
 '0 ',
reps:
 '0 ',
handle:
 'Pulse fitness studio ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/50959421_2348324028787548_8586157636414603264_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=0shYMrp_p8AAX-k1qF_&oh=56d2fc4c6e323b100a315bc119338971&oe=5F6A2EBF ',
  score1:
46,
  score2:
15},
{rank:
51,
name:
 'Sarthak Chokshi',
time:
 '0 ',
reps:
 '0 ',
handle:
 'None ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/50959421_2348324028787548_8586157636414603264_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=0shYMrp_p8AAX-k1qF_&oh=56d2fc4c6e323b100a315bc119338971&oe=5F6A2EBF ',
  score1:
46,
  score2:
15},
{rank:
51,
name:
 'Farhan Khan',
time:
 '0 ',
reps:
 '0 ',
handle:
 ' ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/50959421_2348324028787548_8586157636414603264_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=0shYMrp_p8AAX-k1qF_&oh=56d2fc4c6e323b100a315bc119338971&oe=5F6A2EBF ',
  score1:
46,
  score2:
15},
{rank:
51,
name:
 'Cyrus Gadiwalla',
time:
 '0 ',
reps:
 '0 ',
handle:
 'Cykick ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/50959421_2348324028787548_8586157636414603264_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=0shYMrp_p8AAX-k1qF_&oh=56d2fc4c6e323b100a315bc119338971&oe=5F6A2EBF ',
  score1:
46,
  score2:
15},
{rank:
51,
name:
 'Archit Kalra',
time:
 '0 ',
reps:
 '0 ',
handle:
 'Cult ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/50959421_2348324028787548_8586157636414603264_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=0shYMrp_p8AAX-k1qF_&oh=56d2fc4c6e323b100a315bc119338971&oe=5F6A2EBF ',
  score1:
46,
  score2:
15},
{rank:
51,
name:
 'Rahul Garg',
time:
 '0 ',
reps:
 '0 ',
handle:
 'Reshape ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/50959421_2348324028787548_8586157636414603264_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=0shYMrp_p8AAX-k1qF_&oh=56d2fc4c6e323b100a315bc119338971&oe=5F6A2EBF ',
  score1:
46,
  score2:
15},
{rank:
51,
name:
 'Yan Ezung',
time:
 '0 ',
reps:
 '0 ',
handle:
 'Gynaholic ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/50959421_2348324028787548_8586157636414603264_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=0shYMrp_p8AAX-k1qF_&oh=56d2fc4c6e323b100a315bc119338971&oe=5F6A2EBF ',
  score1:
46,
  score2:
15},
{rank:
51,
name:
 'Pradum Amte',
time:
 '0 ',
reps:
 '0 ',
handle:
 'Vigor 2.0 gym ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/50959421_2348324028787548_8586157636414603264_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=0shYMrp_p8AAX-k1qF_&oh=56d2fc4c6e323b100a315bc119338971&oe=5F6A2EBF ',
  score1:
46,
  score2:
15},
{rank:
51,
name:
 'Abhishek T',
time:
 '0 ',
reps:
 '0 ',
handle:
 'Solitaire ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/50959421_2348324028787548_8586157636414603264_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=0shYMrp_p8AAX-k1qF_&oh=56d2fc4c6e323b100a315bc119338971&oe=5F6A2EBF ',
  score1:
46,
  score2:
15},
{rank:
51,
name:
 'Adil Singh',
time:
 '0 ',
reps:
 '0 ',
handle:
 'No gym ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/50959421_2348324028787548_8586157636414603264_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=0shYMrp_p8AAX-k1qF_&oh=56d2fc4c6e323b100a315bc119338971&oe=5F6A2EBF ',
  score1:
46,
  score2:
15},
{rank:
51,
name:
 'Ajinkya Sahu',
time:
 '0 ',
reps:
 '0 ',
handle:
 'Ajinkyas fitness hub ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/50959421_2348324028787548_8586157636414603264_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=0shYMrp_p8AAX-k1qF_&oh=56d2fc4c6e323b100a315bc119338971&oe=5F6A2EBF ',
  score1:
46,
  score2:
15},
{rank:
51,
name:
 'Bharathesh Mysoremath',
time:
 '0 ',
reps:
 '0 ',
handle:
 'Cultfit ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/50959421_2348324028787548_8586157636414603264_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=0shYMrp_p8AAX-k1qF_&oh=56d2fc4c6e323b100a315bc119338971&oe=5F6A2EBF ',
  score1:
46,
  score2:
15},
{rank:
51,
name:
 'Binu Sarkar',
time:
 '0 ',
reps:
 '0 ',
handle:
 'The Outfit ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/50959421_2348324028787548_8586157636414603264_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=0shYMrp_p8AAX-k1qF_&oh=56d2fc4c6e323b100a315bc119338971&oe=5F6A2EBF ',
  score1:
46,
  score2:
15},
{rank:
51,
name:
 'Durgesh Choubey',
time:
 '0 ',
reps:
 '0 ',
handle:
 'Home Workout ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/50959421_2348324028787548_8586157636414603264_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=0shYMrp_p8AAX-k1qF_&oh=56d2fc4c6e323b100a315bc119338971&oe=5F6A2EBF ',
  score1:
46,
  score2:
15},
{rank:
51,
name:
 'Farhan Hussain',
time:
 '0 ',
reps:
 '0 ',
handle:
 'Snap fitness New Bel Road ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/50959421_2348324028787548_8586157636414603264_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=0shYMrp_p8AAX-k1qF_&oh=56d2fc4c6e323b100a315bc119338971&oe=5F6A2EBF ',
  score1:
46,
  score2:
15},
{rank:
51,
name:
 'Gohan Hyperbeast',
time:
 '0 ',
reps:
 '0 ',
handle:
 'Multifit ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/50959421_2348324028787548_8586157636414603264_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=0shYMrp_p8AAX-k1qF_&oh=56d2fc4c6e323b100a315bc119338971&oe=5F6A2EBF ',
  score1:
46,
  score2:
15},
{rank:
51,
name:
 'Harsh Kumawat',
time:
 '0 ',
reps:
 '0 ',
handle:
 'No Gym ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/50959421_2348324028787548_8586157636414603264_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=0shYMrp_p8AAX-k1qF_&oh=56d2fc4c6e323b100a315bc119338971&oe=5F6A2EBF ',
  score1:
46,
  score2:
15},
{rank:
51,
name:
 'Harshad Makwana',
time:
 '0 ',
reps:
 '0 ',
handle:
 'Home ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/50959421_2348324028787548_8586157636414603264_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=0shYMrp_p8AAX-k1qF_&oh=56d2fc4c6e323b100a315bc119338971&oe=5F6A2EBF ',
  score1:
46,
  score2:
15},
{rank:
51,
name:
 'Jeetu Sachanandani',
time:
 '0 ',
reps:
 '0 ',
handle:
 'Coastal Fitness ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/50959421_2348324028787548_8586157636414603264_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=0shYMrp_p8AAX-k1qF_&oh=56d2fc4c6e323b100a315bc119338971&oe=5F6A2EBF ',
  score1:
46,
  score2:
15},
{rank:
51,
name:
 'Jerry Sabore',
time:
 '0 ',
reps:
 '0 ',
handle:
 'None ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/50959421_2348324028787548_8586157636414603264_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=0shYMrp_p8AAX-k1qF_&oh=56d2fc4c6e323b100a315bc119338971&oe=5F6A2EBF ',
  score1:
46,
  score2:
15},
{rank:
51,
name:
 'Karthikeyan Madeshwaran',
time:
 '0 ',
reps:
 '0 ',
handle:
 'Reshape ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/50959421_2348324028787548_8586157636414603264_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=0shYMrp_p8AAX-k1qF_&oh=56d2fc4c6e323b100a315bc119338971&oe=5F6A2EBF ',
  score1:
46,
  score2:
15},
{rank:
51,
name:
 'Kashish Agarwal',
time:
 '0 ',
reps:
 '0 ',
handle:
 'Celebrity fitness studio ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/50959421_2348324028787548_8586157636414603264_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=0shYMrp_p8AAX-k1qF_&oh=56d2fc4c6e323b100a315bc119338971&oe=5F6A2EBF ',
  score1:
46,
  score2:
15},
{rank:
51,
name:
 'Nikhil Sharma',
time:
 '0 ',
reps:
 '0 ',
handle:
 'United ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/50959421_2348324028787548_8586157636414603264_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=0shYMrp_p8AAX-k1qF_&oh=56d2fc4c6e323b100a315bc119338971&oe=5F6A2EBF ',
  score1:
46,
  score2:
15},
{rank:
51,
name:
 'Nishant Purushothaman',
time:
 '0 ',
reps:
 '0 ',
handle:
 'Limitless.365 ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/50959421_2348324028787548_8586157636414603264_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=0shYMrp_p8AAX-k1qF_&oh=56d2fc4c6e323b100a315bc119338971&oe=5F6A2EBF ',
  score1:
46,
  score2:
15},
{rank:
51,
name:
 'Prabhat Pandey',
time:
 '0 ',
reps:
 '0 ',
handle:
 'Omax ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/50959421_2348324028787548_8586157636414603264_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=0shYMrp_p8AAX-k1qF_&oh=56d2fc4c6e323b100a315bc119338971&oe=5F6A2EBF ',
  score1:
46,
  score2:
15},
{rank:
51,
name:
 'Rajat Sharma',
time:
 '0 ',
reps:
 '0 ',
handle:
 'Brownboyaesthetic ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/50959421_2348324028787548_8586157636414603264_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=0shYMrp_p8AAX-k1qF_&oh=56d2fc4c6e323b100a315bc119338971&oe=5F6A2EBF ',
  score1:
46,
  score2:
15},
{rank:
51,
name:
 'Rishabh Birla',
time:
 '0 ',
reps:
 '0 ',
handle:
 'CrossFit 7 seas ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/50959421_2348324028787548_8586157636414603264_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=0shYMrp_p8AAX-k1qF_&oh=56d2fc4c6e323b100a315bc119338971&oe=5F6A2EBF ',
  score1:
46,
  score2:
15},
{rank:
51,
name:
 'Sachin Panwar',
time:
 '0 ',
reps:
 '0 ',
handle:
 'MMA accedmy ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/50959421_2348324028787548_8586157636414603264_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=0shYMrp_p8AAX-k1qF_&oh=56d2fc4c6e323b100a315bc119338971&oe=5F6A2EBF ',
  score1:
46,
  score2:
15},
{rank:
51,
name:
 'Sanjay Yadav',
time:
 '0 ',
reps:
 '0 ',
handle:
 'Athletes revolution ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/50959421_2348324028787548_8586157636414603264_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=0shYMrp_p8AAX-k1qF_&oh=56d2fc4c6e323b100a315bc119338971&oe=5F6A2EBF ',
  score1:
46,
  score2:
15},
{rank:
51,
name:
 'Shehbaz Malik',
time:
 '0 ',
reps:
 '0 ',
handle:
 'Mahkdumiya ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/50959421_2348324028787548_8586157636414603264_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=0shYMrp_p8AAX-k1qF_&oh=56d2fc4c6e323b100a315bc119338971&oe=5F6A2EBF ',
  score1:
46,
  score2:
15},
{rank:
51,
name:
 'Sumit Kumar',
time:
 '0 ',
reps:
 '0 ',
handle:
 'No Gym ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/50959421_2348324028787548_8586157636414603264_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=0shYMrp_p8AAX-k1qF_&oh=56d2fc4c6e323b100a315bc119338971&oe=5F6A2EBF ',
  score1:
46,
  score2:
15},
{rank:
51,
name:
 'Umang Bhabar',
time:
 '0 ',
reps:
 '0 ',
handle:
 'CrossFit cave studio ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/50959421_2348324028787548_8586157636414603264_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=0shYMrp_p8AAX-k1qF_&oh=56d2fc4c6e323b100a315bc119338971&oe=5F6A2EBF ',
  score1:
46,
  score2:
15},
{rank:
51,
name:
 'Vijalesh Krishnan',
time:
 '0 ',
reps:
 '0 ',
handle:
 'Self ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/50959421_2348324028787548_8586157636414603264_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=0shYMrp_p8AAX-k1qF_&oh=56d2fc4c6e323b100a315bc119338971&oe=5F6A2EBF ',
  score1:
46,
  score2:
15},
{rank:
51,
name:
 'Virendra Singh',
time:
 '0 ',
reps:
 '0 ',
handle:
 'Crossone Fitness ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/50959421_2348324028787548_8586157636414603264_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=0shYMrp_p8AAX-k1qF_&oh=56d2fc4c6e323b100a315bc119338971&oe=5F6A2EBF ',
  score1:
46,
  score2:
15},
{rank:
51,
name:
 'Vishal Kumar',
time:
 '0 ',
reps:
 '0 ',
handle:
 'COEP ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/50959421_2348324028787548_8586157636414603264_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=0shYMrp_p8AAX-k1qF_&oh=56d2fc4c6e323b100a315bc119338971&oe=5F6A2EBF ',
  score1:
46,
  score2:
15} ];

const teamFemale = [
    {rank:
1,
name:
 'Saloni Chandhok',
time:
 '148 ',
reps:
 '177 ',
handle:
 'Body Mechanics ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/106569504_1026042451176752_7744782913313413974_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=RkBAULnH5nEAX8mSiIF&oh=4ef7fefd36ba6ec3268f3bf1eeb80c55&oe=5F684613 ',
  score1:
3,
  score2:
1},
{rank:
2,
name:
 'Namrata Judoka',
time:
 '162 ',
reps:
 '165 ',
handle:
 '21st century gym ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/102379998_569699027257191_7993295032354611231_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=iaHvJfPyXNgAX8Rt50D&oh=417a8c2fbd9dc6dc831cb87a4cf97eb1&oe=5F6B4F81 ',
  score1:
6,
  score2:
2},
{rank:
3,
name:
 'Vidya Somaiah',
time:
 '132 ',
reps:
 '0 ',
handle:
 'VR Fitness ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/107821293_691952844982369_5789299806499084359_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=EOJnfLnkAuAAX9EwIC9&oh=2fd612be64c20ca29dade9623fe8ae91&oe=5F6D973B ',
  score1:
1,
  score2:
9},
{rank:
3,
name:
 'Salbani Sarah',
time:
 '132 ',
reps:
 '0 ',
handle:
 'Efficient fitness studio ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/104393058_911333496056724_4545996149357820060_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=0-W2BMBgPkoAX_noYcr&oh=9dc1208970a2cc3ec9fa2594a7dcd5e8&oe=5F6CA31D ',
  score1:
1,
  score2:
9},
{rank:
5,
name:
 'Ria Verma',
time:
 '174 ',
reps:
 '123 ',
handle:
 'Crossfit forsure ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/117429202_291004625326117_4222586372568893358_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=EsgBLnj2hwsAX_X2SsH&oh=e31520d25f43660c5bb8bd85057b2622&oe=5F688AAA ',
  score1:
7,
  score2:
4},
{rank:
6,
name:
 'Binita Kar',
time:
 '47Rep',
reps:
 '128 ',
handle:
 'Local ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/79786299_446582296031393_2391266154929717248_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=gFqNA2ezJzUAX-qs0wk&oh=4f56842794903562536a73c14c959670&oe=5F6E9C26 ',
  score1:
9,
  score2:
3},
{rank:
7,
name:
 'Satya S',
time:
 '153 ',
reps:
 '0 ',
handle:
 'Home ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/117986703_1641266036049849_1642051821890938665_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=AynYgziDQqAAX82u2Y3&oh=37c372f5f285c0b8bb339d160bc82c3b&oe=5F6F34AD ',
  score1:
4,
  score2:
9},
{rank:
8,
name:
 'Kiran Rawat',
time:
 '177 ',
reps:
 '119 ',
handle:
 'Self ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/117245335_238299143938718_5083012655515404617_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=WuAKqsZYbS8AX_lTgqr&oh=64f1a61de12761d5acc2727c095701a9&oe=5F6B1820 ',
  score1:
8,
  score2:
6},
{rank:
8,
name:
 'Riya Thapa',
time:
 '154 ',
reps:
 '0 ',
handle:
 'Home ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/117560285_220522979325117_8003767991457620427_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=u7brrMgXgigAX_lM0ET&oh=8a1e1b289fddb743008f3331fd1b39c5&oe=5F68DCD5 ',
  score1:
5,
  score2:
9},
{rank:
10,
name:
 'Neethi Pillai',
time:
 '43Rep',
reps:
 '123 ',
handle:
 'Posture Fitness ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/111145374_1212295542458750_4689418622754964606_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=UUcBxC4lOOUAX-tx7kC&oh=3ea63a3b3301485937aa7e2afa5a529a&oe=5F66A63E ',
  score1:
11,
  score2:
4},
{rank:
11,
name:
 'Anushansha Shukla',
time:
 '45Rep',
reps:
 '0 ',
handle:
 'NA ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/116795300_124613109002125_6882178761060560907_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=oRia3J5pQsQAX8SK-1J&oh=db606eacd41e3dcef2b45922aebff1aa&oe=5F651ECC ',
  score1:
10,
  score2:
9},
{rank:
12,
name:
 'Jyoti Jain',
time:
 '40Rep',
reps:
 '115 ',
handle:
 'Club house ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/65767443_1069914523398471_2193765283573792768_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=7VQCjI9PTeAAX9CqXci&oh=74bc1ef97730cf3de8a8b081a40b06e0&oe=5F6BB323 ',
  score1:
12,
  score2:
8},
{rank:
13,
name:
 'Jyoti Rawat',
time:
 '31Rep',
reps:
 '118 ',
handle:
 'Home ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/93224959_2733002913493654_8612719333375737856_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=ytcKqOLJ-78AX-gIwYN&oh=254d759f273c82e218529a080379fa9f&oe=5F66778E ',
  score1:
14,
  score2:
7},
{rank:
14,
name:
 'Priyanka Mittal',
time:
 '38Rep',
reps:
 '0 ',
handle:
 'Home ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/79383188_2582313198703741_7849895612181905408_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=uxLK8Y7gE5oAX9mcpx4&oh=ea9b439090cdf4739f2b00077f6483e3&oe=5F66A1D6 ',
  score1:
13,
  score2:
9},
{rank:
15,
name:
 'Mansi Sanghavi',
time:
 '0 ',
reps:
 '0 ',
handle:
 'Anytime Fitness ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/50959421_2348324028787548_8586157636414603264_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=0shYMrp_p8AAX-k1qF_&oh=56d2fc4c6e323b100a315bc119338971&oe=5F6A2EBF ',
  score1:
15,
  score2:
9},
{rank:
15,
name:
 'Tejal Jain',
time:
 '0 ',
reps:
 '0 ',
handle:
 'no ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/50959421_2348324028787548_8586157636414603264_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=0shYMrp_p8AAX-k1qF_&oh=56d2fc4c6e323b100a315bc119338971&oe=5F6A2EBF ',
  score1:
15,
  score2:
9},
{rank:
15,
name:
 'Mallika Guglani',
time:
 '0 ',
reps:
 '0 ',
handle:
 'Brownboyaesthetic ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/50959421_2348324028787548_8586157636414603264_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=0shYMrp_p8AAX-k1qF_&oh=56d2fc4c6e323b100a315bc119338971&oe=5F6A2EBF ',
  score1:
15,
  score2:
9},
{rank:
15,
name:
 'Archana Kumari Sah',
time:
 '0 ',
reps:
 '0 ',
handle:
 'Curefit ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/50959421_2348324028787548_8586157636414603264_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=0shYMrp_p8AAX-k1qF_&oh=56d2fc4c6e323b100a315bc119338971&oe=5F6A2EBF ',
  score1:
15,
  score2:
9},
{rank:
15,
name:
 'Gayetry Sur',
time:
 '0 ',
reps:
 '0 ',
handle:
 'SAP Fitness ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/50959421_2348324028787548_8586157636414603264_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=0shYMrp_p8AAX-k1qF_&oh=56d2fc4c6e323b100a315bc119338971&oe=5F6A2EBF ',
  score1:
15,
  score2:
9},
{rank:
15,
name:
 'Harshada Upasani',
time:
 '0 ',
reps:
 '0 ',
handle:
 'Cult ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/50959421_2348324028787548_8586157636414603264_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=0shYMrp_p8AAX-k1qF_&oh=56d2fc4c6e323b100a315bc119338971&oe=5F6A2EBF ',
  score1:
15,
  score2:
9},
{rank:
15,
name:
 'Pinky Solanki',
time:
 '0 ',
reps:
 '0 ',
handle:
 'Fitness 5 Gym ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/50959421_2348324028787548_8586157636414603264_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=0shYMrp_p8AAX-k1qF_&oh=56d2fc4c6e323b100a315bc119338971&oe=5F6A2EBF ',
  score1:
15,
  score2:
9},
{rank:
15,
name:
 'Sana Feroz',
time:
 '0 ',
reps:
 '0 ',
handle:
 'Wow gym ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/50959421_2348324028787548_8586157636414603264_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=0shYMrp_p8AAX-k1qF_&oh=56d2fc4c6e323b100a315bc119338971&oe=5F6A2EBF ',
  score1:
15,
  score2:
9},
{rank:
15,
name:
 'Shirin Kapadia',
time:
 '0 ',
reps:
 '0 ',
handle:
 'Home ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/50959421_2348324028787548_8586157636414603264_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=0shYMrp_p8AAX-k1qF_&oh=56d2fc4c6e323b100a315bc119338971&oe=5F6A2EBF ',
  score1:
15,
  score2:
9},
{rank:
15,
name:
 'Shivani Jaiswal',
time:
 '0 ',
reps:
 '0 ',
handle:
 'Gym Planet ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/50959421_2348324028787548_8586157636414603264_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=0shYMrp_p8AAX-k1qF_&oh=56d2fc4c6e323b100a315bc119338971&oe=5F6A2EBF ',
  score1:
15,
  score2:
9},
{rank:
15,
name:
 'Shubhangi Maikhuri',
time:
 '0 ',
reps:
 '0 ',
handle:
 'The fitness garage ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/50959421_2348324028787548_8586157636414603264_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=0shYMrp_p8AAX-k1qF_&oh=56d2fc4c6e323b100a315bc119338971&oe=5F6A2EBF ',
  score1:
15,
  score2:
9},
{rank:
15,
name:
 'Suchika Tariyal',
time:
 '0 ',
reps:
 '0 ',
handle:
 'The fitness garage ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/50959421_2348324028787548_8586157636414603264_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=0shYMrp_p8AAX-k1qF_&oh=56d2fc4c6e323b100a315bc119338971&oe=5F6A2EBF ',
  score1:
15,
  score2:
9},
{rank:
15,
name:
 'Sweta Prabhu',
time:
 '0 ',
reps:
 '0 ',
handle:
 'Training with nishant ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/50959421_2348324028787548_8586157636414603264_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=0shYMrp_p8AAX-k1qF_&oh=56d2fc4c6e323b100a315bc119338971&oe=5F6A2EBF ',
  score1:
15,
  score2:
9},
{rank:
15,
name:
 'Tina Goradia',
time:
 '0 ',
reps:
 '0 ',
handle:
 'Crossfit7seas ',
  img:
 'https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/50959421_2348324028787548_8586157636414603264_n.jpg?_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=0shYMrp_p8AAX-k1qF_&oh=56d2fc4c6e323b100a315bc119338971&oe=5F6A2EBF ',
  score1:
15,
  score2:
9} ];


function toggleButton(b1, b2, isFemaleSelected) {
    let selected = 'c-button c-button--orange';
    let deselected = 'c-button c-button--dark';
    btnMale.setAttribute("class", isFemaleSelected ? deselected : selected);
    btnFemale.setAttribute("class", isFemaleSelected ? selected : deselected);
}

btnMale.onclick = function () {
    update(teamMale);
}

btnFemale.onclick = function () {
    update(teamFemale);
}
 
function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}

function update(team) {
    toggleButton(btnMale, btnFemale, team === teamFemale);

    // Find Winner from sent score1 by sorting the drivers in the team array
    team.forEach(member => {
        member.total = member.score2 + member.score1;
    });
    let sortedTeam = team.sort((a, b) => a.total - b.total)
    sortedTeam.map((x, i) => { x.rank = i + 1 });
    for (let i = 1; i < sortedTeam.length; i++) {
        if (sortedTeam[i].total === sortedTeam[i - 1].total) {
            sortedTeam[i].rank = sortedTeam[i - 1].rank;
        }
    }
    let winner = sortedTeam[0];

    list.innerHTML = ''
    let header = htmlToElement(` <li class="c-list__item">
    <div class="c-list__grid">
        <div class="u-text--left u-text--small u-text--medium">Rank</div>
        <div class="u-text--left u-text--small u-text--medium">Team Member</div>
        <div class="u-display--flex flex-row">
            <div class="u-text--right u-text--small u-text--medium w-60">Workout 1 Score</div> &nbsp; 
            <div class="u-text--right u-text--small u-text--medium w-60">Workout 2 Score</div> &nbsp;
            <div class="u-text--right u-text--small u-text--medium w-60">Total Score</div>
        </div>
    </div>
</li>`);
    list.appendChild(header);
    team.forEach(member => {
        let newRow = document.createElement('li');
        newRow.classList = 'c-list__item';
        newRow.innerHTML = `
		<div class="c-list__grid">
			<div class="c-flag c-place u-bg--transparent">${member.rank}</div>
			<div class="c-media">
				<img class="c-avatar c-media__img" src="${member.img}" />
				<div class="c-media__content">
					<div class="c-media__title">${member.name}</div>
					<a class="c-media__link u-text--small" href="https://instagram.com/${member.handle}" target="_blank">@${member.handle}</a>
         <!-- <p class="c-media__link u-text--small">${member.time}s, ${member.reps} reps</p> -->
         
				</div>
			</div>
            <div class="u-text--right c-score1">
                <div class="u-display--flex flex-row">
                    <div class="u-mt--8  w-60">
                        <strong>${member.score1}</strong>
                       <p class="c-media__link u-text--small">(${member.time}s)</p> 
                    </div> &nbsp;
                    <div class="u-mt--8  w-60">
                        <strong>${member.score2}</strong>
                      <p class="c-media__link u-text--small">(${member.reps}r)</p> 
                    </div> &nbsp; &nbsp; &nbsp; &nbsp;
                    <div class="u-mt--8  w-60">
                        <strong>${member.total}</strong>
                    </div>
                </div>
			</div>
		</div>
	`;
        if (member.rank === 1) {
            newRow.querySelector('.c-place').classList.add('u-text--dark');
            newRow.querySelector('.c-place').classList.add('u-bg--yellow');
            newRow.querySelector('.c-score1').classList.add('u-text--yellow');
        } else if (member.rank === 2) {
            newRow.querySelector('.c-place').classList.add('u-text--dark');
            newRow.querySelector('.c-place').classList.add('u-bg--teal');
            newRow.querySelector('.c-score1').classList.add('u-text--teal');
        } else if (member.rank === 3) {
            newRow.querySelector('.c-place').classList.add('u-text--dark');
            newRow.querySelector('.c-place').classList.add('u-bg--orange');
            newRow.querySelector('.c-score1').classList.add('u-text--orange');
        }

        list.appendChild(newRow);
    });

    // Render winner card
    const winnerCard = document.getElementById('winner');
    winnerCard.innerHTML = `
	<div class="u-text-small u-text--medium u-mb--16">Top Performer</div>
	<img class="c-avatar c-avatar--lg" src="${winner.img}"/>
	<h3 class="u-mt--16">${winner.name}</h3>
	<span class="u-text--teal u-text--small">${winner.total}</span>
`;
}
update(teamFemale);