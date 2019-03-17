Vue.component('app-search', {
	data() {
		return {
			filterData: ''
		}
	},

	template: `
        <form action="#" class="search-form" 
        	@submit.prevent="$parent.$refs.appProducts.filter(filterData)">
            <input type="text" class="search-field" v-model="filterData">
            <button class="btn-search" type="submit" >
                <i class="fa fa-search"></i>
            </button>
        </form>
	`
});