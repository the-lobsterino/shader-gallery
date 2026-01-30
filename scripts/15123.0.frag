#ifdef GL_ES
precision  highp float;//mediump float;
#endif


varying vec2 vTextureCoord;

uniform sampler2D sTexture;

vec4 edges(void)
{
     const float offset = 1.0 / 512.0;
     vec4 c = texture2D(sTexture, vTextureCoord);
     vec4 edge = texture2D(sTexture, vTextureCoord + vec2(-offset, -offset)) +
     texture2D(sTexture, vTextureCoord + vec2(-offset, 0.0)) +
     texture2D(sTexture, vTextureCoord + vec2(-offset, offset)) +
     texture2D(sTexture, vTextureCoord + vec2( 0.0, offset)) +
     texture2D(sTexture, vTextureCoord + vec2( offset, offset)) +
     texture2D(sTexture, vTextureCoord + vec2( offset, 0.0)) +
     texture2D(sTexture, vTextureCoord + vec2( offset, -offset)) +
     texture2D(sTexture, vTextureCoord + vec2( 0.0, -offset));

     return 8.0 * (c + -0.125 * edge);
}

void main() {
     gl_FragColor = edges();
}

//float circle(vec2 p)
//{
//	float ret = length(p);
//	return smoothstep(0.5, ret-0.004, ret) * (ret < 0.5 ? 1.0 : 0.0);
//}



//void main( void ) {

//	vec2 p = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
//	p.x *= resolution.x / resolution.y;
//	float color  = CannySearch;// = circle(cos(p*pow(mod(time,50.0), 3.50)*0.002));
//	gl_FragColor = vec4( vec3( color ), 1.0 );
//
//}