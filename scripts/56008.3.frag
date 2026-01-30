#ifdef GL_ES
precision mediump float;
#endif
//初心者向け解説(日本語)付き

//glslsandbox uniforms
uniform float time;		//time: sec
uniform vec2 resolution;	//解像度

//▼ここから色切り替え▼
//vec3 color = vec3(0.2, 0.42, 0.68); // blue 1
//vec3 color = vec3(0.1, 0.3, 0.6); // blue 2
//vec3 color = vec3(0.6, 0.1, abs(sin(time))); // red
//vec3 color = vec3(0.1, 0.6, 0.3); // green
//▲ここまで色切り替え▲

//乱数の関数
float rand1(float x)
{
	return fract(sin(x) * 4500.0);
	//x-floor(x)を返す
	//floor(x): x以下の最大の整数を返す
}

//同じく乱数の関数(vec2用)、rand1,rand2は実質的には同じもの（扱う数字の型が違う）
float rand2(vec2 co)
{
	return fract(sin(dot(co.xy ,vec2(13.0,78.0))) * 44000.0);
	//dot(x, y): xとyの内積をfloatで返す
	//sin(x): 正弦を返す
}

//invader: 文字の表示についての情報、数をいじると文字が崩壊したり縦に長くなったりする。
float invader(vec2 p, float n)
{
	p.x = abs(p.x);		//abs(x): xの絶対値を返す
	p.y = floor(p.y - 5.0);	//floor(x): x以下の最大の整数を返す
    return step(p.x, 2.0) * step(1.0, floor(mod(n/(exp2(floor(p.x - 3.0*p.y))),2.0)));
	//step(a, x): aはしきい値、xはチェックされる値。
	//しきい値未満の場合は0.0を、それ以上の場合は1.0の二値化を行う関数
	//mod(x, y): x-y*floor(x/y)を返す
	//exp2(x): 2のx乗を返す
}

//ring: 映像の中で定期的に流れる白い波のようなものを作っている。そのための数値。
float ring(vec2 uv, float rnd)//uv:座標, rng(r): 文字の表示（ランダム要素含む）
{
    float t = 0.6*(time+0.2*rnd);	 
    float i = floor(t/2.0);		
    vec2 pos = 2.0*vec2(rand1(i*0.12), rand1(i*2.4))-1.0;
    return smoothstep(0.2, 0.0, abs(length(uv-pos)-mod(t,2.0)));
}

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    vec2 p = fragCoord.xy;			//p  : x, yの値が入っている
	vec2 uv = p / resolution.xy - 0.5;	//uv : -0.5～0.5の値（座標関係）が入っている
    p.y += 120.0*time;				//p.y: 文字をy軸（縦）移動させるプログラミング（1秒に120ずつずれる）
    float r = rand2(floor(p/8.0));		//r  : 文字っぽいものを細かくランダムに表示させるためのもの 
    vec2 ip = mod(p,8.0)-4.0;			//ip : 文字っぽいものの大きさ(間隔)を決定するもの
    
    float a = -0.3*smoothstep(0.1, 0.8, length(uv)) + invader(ip, 800000.0*r) * (0.06 + 0.3*ring(uv,r) + max(0.0, 0.2*sin(10.0*r*time)));
    //【超重要】
    //a:文字の表示に関するすべての情報を含んでいる。(文字の描画や白い波のようなエフェクトなど)	
    //smoothstep(e0, e1, x): スムース補間を行う,ようはe0～e1の間をいい感じに移ろいでくれるやつ
	
	vec2 poz = vec2(gl_FragCoord.x/resolution.x, gl_FragCoord.y/resolution.y);	
	vec3 color = vec3(poz, abs(sin(time)));

	
    fragColor = vec4(color+a, 1.0);
}

void main(void)
{
	/*
    vec2 poz = vec2(gl_FragCoord.x/resolution.x, gl_FragCoord.y/resolution.y);
    vec3 colors = vec3(poz, abs(sin(time)));
	*/
    mainImage(gl_FragColor, gl_FragCoord.xy);
}