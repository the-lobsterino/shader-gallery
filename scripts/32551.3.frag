#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable
// BY COLE KISSANE (coler706@gmail.com)
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
const float PI=atan(0.0,-1.0);
float wa(float val){
	return floor(0.5+sin(val));
}
float hue2rgb(float f1, float f2, float hue) {
    if (hue < 0.0)
        hue += 1.0;
    else if (hue > 1.0)
        hue -= 1.0;
    float res;
    if ((6.0 * hue) < 1.0)
        res = f1 + (f2 - f1) * 6.0 * hue;
    else if ((2.0 * hue) < 1.0)
        res = f2;
    else if ((3.0 * hue) < 2.0)
        res = f1 + (f2 - f1) * ((2.0 / 3.0) - hue) * 6.0;
    else
        res = f1;
    return res;
}

vec3 hsl2rgb(vec3 hsl) {
    vec3 rgb;
    
    if (hsl.y == 0.0) {
        rgb = vec3(hsl.z); // Luminance
    } else {
        float f2;
        
        if (hsl.z < 0.5)
            f2 = hsl.z * (1.0 + hsl.y);
        else
            f2 = hsl.z + hsl.y - hsl.y * hsl.z;
            
        float f1 = 2.0 * hsl.z - f2;
        
        rgb.r = hue2rgb(f1, f2, hsl.x + (1.0/3.0));
        rgb.g = hue2rgb(f1, f2, hsl.x);
        rgb.b = hue2rgb(f1, f2, hsl.x - (1.0/3.0));
    }   
    return rgb;
}

vec3 hsl2rgb(float h, float s, float l) {
    return hsl2rgb(vec3(h, s, l));
}
void main( void ) {
float t=time;
	vec2 position = ( gl_FragCoord.xy / resolution.yy )-vec2(0.5)*resolution.xx/resolution.yx;
	float tro=atan(position.y,position.x)+PI/8.0*3.85;
	vec2 pos2=vec2(cos(tro),sin(tro))*length(position);
	position=pos2;
	vec2 pos=position*vec2(pos2.y*0.1-pos2.x,pos2.x*0.1+pos2.y);
	float color = 0.0;
	float len=length(pos);//abs(position.x)-abs(position.y);
	int bar=int(floor(len*(sin(t)+1.9)*10.0));
	float prog=mod(len*(sin(t)+1.9)*10.0,1.0);
	int dir=int(mod(float(bar),2.0));
	int angle=int(floor(atan(pos.y,pos.x)/atan(0.0,-1.0)*10.0));
	int angp=int(mod(float(bar),2.0));
	float no=wa( (atan(pos.y,pos.x)*10.0+float(angp)*PI*2.0+5.0*t*(float(dir)*2.0-1.0)+0.0*t))/2.0+0.5;
	color += (no);
	//color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );
	//color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
	//color *= sin( time / 10.0 ) * 0.5;
	vec3 col=vec3(color);
	if(no>0.75){
		//col.y=0.0;
		//col.z=0.0;
		col=hsl2rgb(mod(time/10.0,1.0),0.7,0.3);
	}
	if(no==0.5){
		//col.x*=0.5;
	}
	if(no<0.25){
		col=hsl2rgb(mod(time/10.0+0.5,1.0),0.7,0.1);
	}
	gl_FragColor = vec4( col*(prog*1.5), 1.0 );
}