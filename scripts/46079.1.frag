#extension GL_OES_standard_derivatives : enable

#ifdef GL_ES
precision highp float;
#endif

//created by weichaohui@sdk for flyme
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float BORDER = 0.2;

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

//坐标系移动
vec2 move(vec2 pos, float scale, float speed, float rand){
	float move = time*max(resolution.x, resolution.y)/speed;//坐标系移动的距离
	vec2 uv = vec2(gl_FragCoord.x - move, gl_FragCoord.y - move * (sin(rand*10.) + 2.) / 3.);

	return uv;
}

//计算粒子坐标中心位置,粒子位置处理格子随机位置，并且在格子内部做位移动画
vec2 paticle(float cellX, float cellY, float scale, float random, float R){
	vec2 off = abs(vec2(sin(time + cellY*random), cos(time + cellX))+1.0) / 2. *(scale - 2.*R);//自动移动的距离
	vec2 cellCentor = vec2(cellX * scale, cellY * scale) + R +off;


	return cellCentor;
}

const float PI = radians(180.);
vec3 rotate(vec2 pos){
	//绕对角线旋转 x + (resolution.x / resolution.y) * y  = 0;
	float Ay = resolution.x / resolution.y;
	float degree = time / 5.0;//旋转角度
	float c = cos(degree);
	float s = sin(degree);
	mat4 rotateM = mat4(1., Ay * (1.0 - c), Ay * s, 0.,
			   Ay * (1. - c), c + Ay * Ay * (1. - c), -s, 0.,
			   -Ay * s, s, c, 0.,
			   0., 0., 0., 1.);
	vec4 res = vec4(pos, 0., 1.);
	res = res * rotateM;
	return res.xyz;
}

//计算粒子指定位置的颜色
float paricleColor(float alphaSpeed, float R, float random, vec2 center, vec2 pos, float deep){
	float alpha = sin(time / alphaSpeed + random * 1723.23535);
	float d = abs(length(center - pos));
	float k = 1.-smoothstep(0., R, d);
	return abs(k * alpha);
}

float snow(float seed1, float deep){
	float density = 4. + 4. * deep;
	float R = (10. - deep)*5.;
	float speed = 3. + deep * 3.;
	float alphaSpeed = .6;

	float scale  = min(resolution.x, resolution.y) / density;

	vec2 pos = move(resolution.xy, scale, speed, seed1);
	//vec3 xyz = rotate(pos);
	//pos = xyz.xy;
	//R = (sin(time) + 1.)*R;//smoothstep(resolution.x + resolution.y, -(resolution.x + resolution.y), xyz.z)*1000000. * R;

	float cellX = floor(pos.x  / scale);
	float cellY = floor(pos.y / scale);

	float random = sin(rand(vec2(rand(vec2(rand(vec2(cellX+1.1, seed1)) ,cellY+1.1)), (cellX + 0.1)/ (cellY+1.1))));
	if(fract(random) < 0.7 /*|| cellX > 0. || cellY > 0.*/){
		return 0.;
	}

	vec2 cellCentor = paticle(cellX, cellY, scale, random, R);

	return paricleColor(alphaSpeed, R, random, cellCentor, pos, deep);
}

void main( void ) {
	float c = snow(3.241231234, 1.);
	c+=snow(3.685678567, 2.);
	c+=snow(3.345760345, 3.);
	c+=snow(3.678564564, 4.);
	c+=snow(3.685678567, 5.);
	c+=snow(3.345760345, 6.);
	c+=snow(3.678564564, 7.);

	gl_FragColor = vec4( vec3(c), max(c, 0.) * 0.5 );
	//gl_FragColor = vec4(-1.0, -1.0, -1.0, 1.);
}