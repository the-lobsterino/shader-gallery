precision highp float;

uniform vec2 resolution;
uniform float time;
uniform vec2 mouse;

vec3 lightDir = normalize(vec3(1.0, -0.4, 0.9));

float rand(vec3 p){
	//vec3 p2 = vec3(p.xy,1.0);
	return fract(sin(dot(p,vec3(37.1,61.7, 12.4)))*1233758.5453123);
}
float rand(vec2 p){
	return rand(vec3(p, 1.0));
}

vec3 sky(vec3 dir){
	vec3 col1 = vec3(.0, .3, .9);
	vec3 col2  = vec3(.8, .8,.8);
	return mix (col1, col2, (dot(dir, -vec3(0,0,1))+1.0)*0.5);
}

vec3 blockColor(vec3 pos, int type){
	vec3 b = floor(fract(pos+vec3(0.,0.,.0))*16.);
	//b = mod(b,15.);
	vec3 c;
	// using textures from http://www.playmycode.com/build/edit/2793
	if (type == 1){ // DIRT
		c = vec3(0x96,0x6C,0x4A)/255.;
	} else if (type == 2) { // GRASS
		c = vec3(0x96,0x6C,0x4A)/255.;
		float x = b.x+b.y;
		if (b.z > mod(floor((x * x * 3. + x * 81.) / 4.),4.) + 10.)
			c = vec3(0x6A,0xAA,0x40)/255.;
	} else
		c = vec3(1.0,0.0,1.0);
	c = c * (255.-96.*rand(b))/255.;
	return c;
}

vec3 clampPosToBlock(vec3 pos, vec3 block){ // make sure position is INSIDE the block, because small deltas will mess up block pixel colors
	pos = max(pos, block);
	pos = min(pos, block+vec3(.999, .999, .999));
	return pos;
}

vec3 trans(vec3 p, float m){
  	return mod(p, m) - m / 2.0;
}

vec4 u(vec4 a, vec4 b){ // UNION
	if (a.w < b.w) return a;
	else return b;
}

int groundType(vec2 pos){//return 1;
	return 2-int(rand(pos*2.13)*1.2);
	if (floor(mod(pos.x,2.0))==floor(mod(pos.y,1.0)))
		return 1;
	else
		return 2;
}

float groundHeight(vec2 pos){
	return floor(rand(floor(pos))*88.);	
}

vec4 dGroundColumn(vec3 pos, vec2 col){
	col = floor(col);
	float height = groundHeight(col);
	float dist = pos.z - height;
	if (dist<0.)
		height = floor(pos.z);
	else
		height -= 1.;
	dist = max(dist, pos.x-col.x-1.);
	dist = max(dist, -pos.x+col.x);
	dist = max(dist, pos.y-col.y-1.);
	dist = max(dist, -pos.y+col.y);
	return vec4(col, height, dist);
}

vec4 dGround(vec3 pos){
	vec4 dist = dGroundColumn(pos, pos.xy);
	vec3 du = vec3(floor(fract(pos.xy)*2.)*2.-1., 0.); // -1 or +1
	dist = u(dist, dGroundColumn(pos, pos.xy+du.xz));
	dist = u(dist, dGroundColumn(pos, pos.xy+du.zy));
	dist = u(dist, dGroundColumn(pos, pos.xy+du.xy));
	return dist;
	/*
	for (int x=-1;x<=1;x++)
		for (int y=-1;y<=1; y++){
				if (x==0 && y==0) continue;
			dist = u(dist, dGroundColumn(pos, pos.xy+vec2(x,y)));
		}
	return dist;
	*/
}

vec4 d(vec3 pos){
	vec4 dist = dGround(pos);
	float dist2 = 5.-length(pos);
	if (dist2 > dist.w){
		dist = vec4(floor(pos),dist2);
	}
	return dist;
}
 
vec3 getNormal(vec3 p){
  	const float dx = 0.001;
  	return normalize( 
		    vec3(
        		 d(p+vec3(dx,0.0,0.0)).w-d(p+vec3(-dx,0.0,0.0)).w,
        		 d(p+vec3(0.0,dx,0.0)).w-d(p+vec3(0.0,-dx,0.0)).w,
        		 d(p+vec3(0.0,0.0,dx)).w-d(p+vec3(0.0,0.0,-dx)).w
		    )
    	       );
}
 
void main(){
  	vec2 pos = (gl_FragCoord.xy) / resolution.xy;
	pos -= 0.5;
	pos.x *= resolution.x / resolution.y;
	
	
  	//vec3 camPos = vec3(mouse*-10.0, mod(time,1000.0));
	vec3 camPos = vec3(0., -20., 5.);
	camPos += vec3(0.0+time*02.25, 0.0+time*3., 0.0);
  	vec3 camDir = normalize(vec3(0.0, 1.0, -0.2));
	camDir = normalize(vec3(cos(-time*.1), sin(-time*.1), -0.2));
	
  	vec3 camUp = vec3(0.0, 0.0, 1.0);
	camUp = cross(cross(camDir, vec3(0.0, 0.0, 1.0)), camDir);
  	vec3 camSide = cross(camDir, camUp);
  	float focus = 1.8;
 
  	vec3 rayDir = normalize(camSide*pos.x + camUp*pos.y + camDir*focus);
 
  	float t = 0.0;
	vec4 dist;
  	vec3 posOnRay = camPos;
	for(int i=0; i<164; ++i){
		dist = d(posOnRay);
	    	t += dist.w;
		//if(t>10.) break;
	    	posOnRay = camPos + t*rayDir;
	}
	//posOnRay += 0.001*rayDir;
	//dist = d(posOnRay);
	vec3 normal = getNormal(posOnRay);
	vec3 color;
	if(abs(dist.w) < 0.1 ){
		posOnRay = clampPosToBlock(posOnRay, dist.xyz);
		float diff = clamp(dot(lightDir, normal), 0.3, 1.0);
		int block;// = int(dist.y);
		block = groundType(dist.xy);
		
		//block = groundType(posOnRay.xy);
	    	color = blockColor(posOnRay, block) * diff;
	} else if (abs(dist.w) < 0.1){
		color = vec3(1.,0.,1.);
	} else {
	    	color = sky(rayDir);
	}
	
	gl_FragColor = vec4(color, 1.0);
}