# echo "PATH outside environment: $PATH"

# ## printing shell variables is complicated by escaping
# conda run -n tensorflow bash -c "echo \"PATH inside environment: \${PATH}\""

cd /Users/luciano/Documents/sivrg-fceia/lpr/ConvALPR
conda run -n tensorflow python /Users/luciano/Documents/sivrg-fceia/lpr/ConvALPR/SIVRG_TEST.py
