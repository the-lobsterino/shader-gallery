#ifdef GL_ES
    precision highp float;
#endif
uniform sampler2D vTexture;
            
uniform vec2 LensCenter;
uniform vec2 ScreenCenter;
uniform vec2 Scale;
uniform vec2 ScaleIn;
uniform vec4 HmdWarpParam;

varying vec2 vUV;

vec2 HmdWarp(vec2 texIn)
{
    vec2 theta = (texIn - LensCenter) * ScaleIn;
    float rSq = theta.x * theta.x + theta.y * theta.y;
    vec2 theta1 = theta * (HmdWarpParam.x + HmdWarpParam.y * rSq + HmdWarpParam.z * rSq * rSq + HmdWarpParam.w * rSq * rSq * rSq);
    return LensCenter + Scale * theta1;
}

void main()
{
    vec2 tc = HmdWarp(vUV.xy);
	if (any(bvec2(clamp(tc,ScreenCenter-vec2(0.25,0.5), ScreenCenter+vec2(0.25,0.5)) - tc)))
	{
		gl_FragColor = vec4(1, 0.2, 0.2, 1.0);
		return;
	}
                
	gl_FragColor = texture2D(vTexture, tc);
}


