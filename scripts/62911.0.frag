/*
 * Original shader from: https://www.shadertoy.com/view/lt2GzK
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
float iTime = 0.;
#define iResolution resolution

// Emulate a black texture
#define texture(s, uv) vec4(0.0)

// --------[ Original ShaderToy begins here ]---------- //
struct polygon{
	vec2 A, B, C;
};
float sgn(vec2 p1, vec2 p2, vec2 p3){
  return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
}
int PointInTriangle(vec2 pt, vec2 v1, vec2 v2, vec2 v3){
	int b1, b2, b3;

	if(sgn(pt, v1, v2) < 0.0) b1=1;
	if(sgn(pt, v2, v3) < 0.0) b2=1;
	if(sgn(pt, v3, v1) < 0.0) b3=1;
	if((b1 == b2) && (b2 == b3))
		return 1;
	return 0;
}

int PointInTriangle(vec2 pt, polygon X){
	int b1, b2, b3;

	if(sgn(pt, X.A, X.B) < 0.0) b1=1;
	if(sgn(pt, X.B, X.C) < 0.0) b2=1;
	if(sgn(pt, X.C, X.A) < 0.0) b3=1;
	if((b1 == b2) && (b2 == b3))
		return 1;
	return 0;
}

float box(vec2 coord, vec2 pos, vec2 size){
	if((coord.x<(pos.x+size.x)) &&
	   (coord.x>(pos.x-size.x)) &&
	   (coord.y<(pos.y+size.y)) && 
	   (coord.y>(pos.y-size.y)) ) 
		return 1.0;
	return 0.0;
}
float sun(vec2 coord, vec2 pos, float size){
	if(length(coord-pos)<size)
		return 1.0;
	return 0.0;
}
float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

mat2 rotate(float Angle)
{
    mat2 rotation = mat2(
        vec2( cos(Angle),  sin(Angle)),
        vec2(-sin(Angle),  cos(Angle))
    );
	return rotation;
}
float sdCapsule( vec2 p, vec2 a, vec2 b, float r ){
    vec2 pa = p - a, ba = b - a;
    float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
    return min(floor(length( pa - ba*h ) - r),0.);
}
float triangle( vec2 coord, vec2 pos, float angle, float thick, float size){
    vec2 original_coord = coord;
    coord += pos;
    coord *= rotate(angle);
    float collision = 0.0;
    collision += sdCapsule( coord, vec2( 0.0, 0.333)*size, vec2( 0.3,-0.2)*size, thick );
    collision += sdCapsule( coord, vec2( 0.0, 0.333)*size, vec2(-0.3,-0.2)*size, thick );
    collision += sdCapsule( coord, vec2( 0.3,-0.2)*size, vec2(-0.3,-0.2)*size, thick );
    collision += 3.0*texture( iChannel0, original_coord * 0.6 + vec2(iTime*0.02) ).b * 0.6;
    collision += 2.5*texture( iChannel0, original_coord * 0.1 + vec2(iTime*0.001) ).b * 0.4;
    return -min(max(-collision,0.0),1.0);
}




void mainImage( out vec4 fragColor, in vec2 fragCoord ){
	vec4 tulos;
	vec4 lopullinentulos=vec4(1.0);
	vec2 uv = fragCoord.xy / iResolution.xy;
	float aspectCorrection = (iResolution.x/iResolution.y);
	vec2 coordinate_entered = 2.0 * uv - 1.0;
	vec2 coord = vec2(aspectCorrection,1.0) *coordinate_entered;
    vec2 nc=coord;
    vec2 ori_coord=coord;
	for(float rgbare=0.0; rgbare<2.0; rgbare++){
	coord = vec2(aspectCorrection,1.0) *coordinate_entered * (1.+0.2*cos(iTime*0.05));
	coord.x*=1.0+rgbare*0.02;
	coord*=1.0+rand(coord+iTime)/(pow(iTime,7.0)*3.0)-length(coord)*10.0/(pow(iTime*1.1,24.0));
	coord*=1.0+0.1*sin(1.01*0.1);
	tulos=vec4(vec3(0.0/255.0, 0.0/255.0, 0.0/255.0),1.0);
    
    float beat = ceil(iTime);
    coord*=1.0+0.3*sin(iTime*10.)/(1.+33.*mod(iTime,1.));
	
    if(beat>24.)
    	coord+=max(2.0-(iTime-24.)/2.,0.)*vec2(rand(floor(coord*2.))-0.5,rand(floor(coord*2.+44.))-0.5);
	vec3 taikurivitunluttinen=vec3(0.);
    if(beat>8.){
    	taikurivitunluttinen.rb+=0.7*max(1.0-(iTime-8.)/2.,0.)*vec2(rand(floor(coord*2.))-0.5,rand(floor(coord*2.+44.))-0.5);
    	taikurivitunluttinen.rg+=0.7*max(1.0-(iTime-8.)/2.,0.)*vec2(rand(floor(coord))-0.5,rand(floor(coord+44.))-0.5);
    	taikurivitunluttinen.rb-=0.7*max(1.0-(iTime-8.)/2.,0.)*vec2(rand(floor(coord*1.9))-0.5,rand(floor(coord*1.9+44.))-0.5);
    	taikurivitunluttinen.rg-=0.7*max(1.0-(iTime-8.)/2.,0.)*vec2(rand(floor(coord*.9))-0.5,rand(floor(coord*.9+44.))-0.5);
    }
    if(beat>10.){
        coord.x+=( 0.2*sin(iTime*12.+coord.y) ) / (1.0-10.*(iTime-10.));
        coord.y+=( 0.2*sin(iTime*12.+coord.x) ) / (1.0-22.*(iTime-10.));
    }
        
    if(beat>18.){
        coord.x+=( 0.2*sin(iTime*12.+coord.y) ) / (1.0-22.*(iTime-18.));
        coord.y+=( 0.2*sin(iTime*12.+coord.x) ) / (1.0-22.*(iTime-18.));
    	taikurivitunluttinen.rb+=0.7*max(1.0-(iTime-18.)/2.,0.)*vec2(rand(floor(coord*2.))-0.5,rand(floor(coord*2.+44.))-0.5);
    	taikurivitunluttinen.rg+=0.7*max(1.0-(iTime-18.)/2.,0.)*vec2(rand(floor(coord))-0.5,rand(floor(coord+44.))-0.5);
    	taikurivitunluttinen.rb-=0.7*max(1.0-(iTime-18.)/2.,0.)*vec2(rand(floor(coord*1.9))-0.5,rand(floor(coord*1.9+44.))-0.5);
    	taikurivitunluttinen.rg-=0.7*max(1.0-(iTime-18.)/2.,0.)*vec2(rand(floor(coord*.9))-0.5,rand(floor(coord*.9+44.))-0.5);
    }
    if(beat>27.){
        coord.x+=( 0.2*sin(iTime*12.+coord.y) ) / (1.0-10.*(iTime-27.));
        coord.y+=( 0.2*sin(iTime*12.+coord.x) ) / (1.0-22.*(iTime-27.));
        coord.x+=( 0.1*sin(iTime*12.+coord.y) ) * (1.0+(iTime-27.));
        coord.y+=( 0.1*sin(iTime*12.+coord.x) ) * (1.0+(iTime-27.));
    }
        
        
        
	tulos.rgb+=taikurivitunluttinen;
    if(beat>28.)
        coord/=4.3*(iTime-27.75);
    if(beat>10.)
        coord*=1.0+0.3*length(coord)*length(coord)*min(max((iTime-10.)*3.,0.),1.);
        
    if(beat>20. && beat<22.){
    	for(float i=0.; i<8.; i++){
        	tulos.rgb += sun(coord, vec2(0.), mod(i*(0.3-.5*(iTime-20.)),14.)/(1.+(1.+i*0.1)*0.8*(iTime-20.)*0.01))*vec3(0.9,0.3,0.4)/(1.+(iTime-20.)/8.);
        	tulos.rgb -= sun(coord, vec2(0.), mod(i*(0.3-0.05-.5*(iTime-20.)),14.)/(1.+(1.+i*0.1)*0.8*(iTime-20.)*0.01))*vec3(0.9,0.3,0.4)*1.2/(1.+(iTime-20.)/8.);
        }
    }
    for(float i=0.; i<32.; i++){
        float magiTime=iTime-21.;
        float drop=0.1*pow(magiTime*(1.+rand(vec2(i*6464.))),2.);
    	tulos.rgb += sun(coord, 22.*magiTime*magiTime*vec2(rand(vec2(i+64.))-0.5,rand(vec2(i+199.))-0.5), max(min(.065+rand(vec2(i))*.04,0.),magiTime))*vec3(0.9,0.3,0.4);
    }
        
        if(beat>14.){
            if(beat<20.)
            coord.y+=sin((iTime-14.)/3.);
        	coord*=rotate(iTime-14.);
        }
    if(beat>6.)
        coord*=rotate(min(iTime-6.,3.141*0.5)+sin(iTime*6.)/(1.+4.75*pow(iTime-6.,2.)));   
        
    if(beat>8.)
        coord.y=mod(coord.y+0.5,1.)-0.5;
    if(beat>12.)
        coord.y=mod(coord.y+0.5-iTime*4.,1.)-0.5;
        
    if(beat>18.){
        tulos.rgb-=sin(coord.x*0.1);
        coord.x=mod(coord.x+0.5,1.)-0.5;
    }
        
    if(beat>16.)
        coord*=rotate(-(iTime-16.)*3.141);
	if(mod(coord.x+coord.y+1.01*0.1+iTime/4.,0.2)<0.1){
		if(box(coord,vec2(0.),vec2(4.,0.4))==1.)
		   	tulos.xyz-=vec3(0.4,0.5,0.3)*0.1;
		
        if(PointInTriangle(
        							coord, 
        							vec2(0.,.5),
        							vec2(-.5,0.),
        							vec2(.5,0.) ) == 1 && beat > 2.)
		   	tulos.xyz+=vec3(1.1);
        if(box(coord,vec2(0.,-.25),vec2(.25,0.25))==1. && beat > 4.)
		   	tulos.xyz=vec3(1.);
        
	}
        
    if(beat>28.)
        tulos+=(iTime-27.75);
        
    float collision = 0.0;
    if(collision<0.0)
        tulos.xyz += vec3(0.1);
	
	tulos.xyz=tulos.xyz-vec3(min(max(-0.57+length(ori_coord)*0.32,0.0),1.0))+vec3(0.015+0.03*rand(vec2(ori_coord.x+ori_coord.y,1.01*ori_coord.y*ori_coord.x)));
	
	if(rgbare==0.0)
		lopullinentulos.r=tulos.r;
	if(rgbare==1.0)
		lopullinentulos.gb=tulos.gb;
	}
	lopullinentulos.xyz=lopullinentulos.xyz*(1.2-0.4*mod(fragCoord.y,2.0));
    lopullinentulos.rgb = vec3(length(lopullinentulos.rgb));
	lopullinentulos.xyz+=floor(mod(nc.y*1000.0,32.0)/32.0 + 2./32.0) / 12.0;
	lopullinentulos.xyz+=floor(mod(nc.x*1000.0,32.0)/32.0 + 2./32.0) / 12.0;
    lopullinentulos.rgb-=rand(coord*iTime)/12.0;
	lopullinentulos.xyz=lopullinentulos.xyz/1.3 * mod(fragCoord.y,2.0);
    lopullinentulos.rgb*=vec3(0.0,1.0,0.4);
	fragColor = lopullinentulos;
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    iTime = mod(time, 30.);
    mainImage(gl_FragColor, gl_FragCoord.xy);
    gl_FragColor.a = 1.0;
}